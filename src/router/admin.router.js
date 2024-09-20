const router = require("./extensions").Router();
const models = router.models;
let fetch = require("node-fetch");
const {generateToken, generateRefreshToken, generateTokenOnRefresh} = require("../lib/token");
const {isEmpty} = require("../lib/validate");
const {ThrowReturn} = require("./extensions");
const {OTP_URL, URL_LOGIN} = require("../../config/setting");
const {Op} = require("sequelize");
const {callApiLogin} = require("../lib/signature");
const redisPool = require("../utils/redispool");
const moment = require("moment");

const create = async (req, res) => {
    let {roles, ...body} = req.body;
    // validate input data
    if (isEmpty(body.phone) || isEmpty(roles)) throw new ThrowReturn("Invalid input data");
    // create admin
    const postFrom = {
        ...body,
        facility_id: 0,
        permission: 0,
        level: 0,
        password: ""
    };
    const newAdmin = await models.SecretaryAdminCm.findOrCreate({
        where: {phone: body.phone},
        defaults: postFrom,
        raw: true
    });
    if (!newAdmin[1]) throw new ThrowReturn("Số điện thoại đã tồn tại");
    // create role
    const roles_create = roles.map(role => {
        return {
            role_id: role,
            model_id: newAdmin[0].id,
            model_type: "App\\User"
        };
    });
    await models.SecretaryCmsModelHasRole.bulkCreate(roles_create);

    return res.sendData(null, "Create success!");
};

const detail = async (req, res) => {
    const { currentAdmin } = req;
    let admin = await models.SecretaryAdminCm.findOne({
        where: { id: currentAdmin.id, is_active: 0 },
        attributes: { exclude: ["password"] },
        include: [
            { model: models.SecretaryCmsRole, through: { attributes: [] }, as: "role_admin" }
        ]
    });
    if (isEmpty(admin)) throw new ThrowReturn("Admin not found");
    return res.sendData(admin);
};


const remove = async (req, res) => {
    const {admin_id} = req.params;
    // remove role
    await models.SecretaryCmsModelHasRole.destroy({where: {model_id: admin_id}});
    // remove admin
    await models.SecretaryAdminCm.destroy({where: {id: admin_id}});
    return res.sendData(null, "Remove success");
};

const token = async (req, res) => {
    const refreshToken = req.body.refresh_token || req.query.refresh_token;
    const id = await generateTokenOnRefresh(refreshToken);
    if (isEmpty(id)) throw new ThrowReturn("Refresh token expire!");
    const admin = await models.AdminCm.findOne({where: {id}, attributes: {exclude: ["password"]}, raw: true});
    const token = await generateToken(admin);
    res.sendData({token});
};

const verifyCaptcha = async (req, res) => {
    const {phone, password} = req.body;
    try {
        const user = await models.SecretaryAdminCm.findOne({
            where: {
                phone: phone,
                password: password
            },
            raw: true
        });
        if (!user) {
            return res.json({
                error_code: 1,
                message: 'Không tìm thấy tài khoản hoặc mật khẩu sai'
            });
        }
        const token = await generateToken(user);
        const refreshToken = await generateRefreshToken(user.id);
        res.sendData({token, refreshToken, admin: user}, "Đăng nhập thành công");
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
};

const lists = async (req, res) => {
    let {page, limit, phone, name, role_id, keyword} = req.body;
    if (isEmpty(limit)) limit = 10;
    if (isEmpty(page)) page = 1;
    let role = null;
    if (!isEmpty(role_id)) {
        const roles = await models.SecretaryCmsModelHasRole.findAll({where: {role_id}});
        role = roles.map(value => value.model_id);
    }
    const {count, rows} = await models.SecretaryAdminCm.findAndCountAll({
        include: [
            {
                model: models.SecretaryCmsRole,
                as: "role_admin",
                attributes: ["id", "name", "title"],
                where: {
                    [Op.and]: [
                        keyword ? {[Op.or]: [{id: keyword}, {name: {[Op.substring]: keyword}}]} : {}
                    ]
                }
            }
        ],
        where: {
            [Op.and]: [
                name ? {name: {[Op.substring]: name}} : {},
                phone ? {phone} : {},
                role ? {id: {[Op.in]: role}} : {}
            ]
        },
        order: [["created_at", "DESC"]],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
    });
    res.sendData({data: rows, total: count});
};

const search = async (req, res) => {
    let {limit, page, vID} = req.query;
    if (isEmpty(limit)) limit = 10;
    if (isEmpty(page)) page = 1;

    const data = await models.SecretaryAdminCm.findAll({
        where: {[Op.or]: [{is_active: 0}, {id: vID}, {name: {[Op.substring]: vID}}]},
        attributes: ["id", "name"],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        raw: true
    });

    return res.sendData(data);
};

const getAllAdmin = async (req, res) => {
    let allAdmin = await models.SecretaryAdminCm.findAll({
        where: {is_active: 0}
    });
    res.sendData(allAdmin);
};

const updateAdmin = async (req, res) => {
    const {admin_id} = req.params;
    let {roles, ...body} = req.body;
    if (isEmpty(body.phone) || isEmpty(roles)) throw new ThrowReturn("Invalid input data");
    const roleAdmin = await models.SecretaryCmsModelHasRole.findAll({
        where: {model_id: admin_id}
    });
    const role_id = roleAdmin.map(role => role.role_id);

    const roles_remove = role_id.filter(function (element) {
        return roles.indexOf(element) === -1;
    });

    const roles_create = roles.filter(function (element) {
        return role_id.indexOf(element) === -1;
    }).map(item => {
        return {
            role_id: item,
            model_id: admin_id,
            model_type: "App\\User"
        };
    });
    if (roles_remove.length > 0) {
        await models.SecretaryCmsModelHasRole.destroy({
            where: {
                model_id: admin_id,
                role_id: {[Op.in]: roles_remove}
            }

        });
    }
    if (roles_create.length > 0) {
        await models.SecretaryCmsModelHasRole.bulkCreate(roles_create);
    }
    const postFrom = {
        ...body,
        birthday: moment(body.birthday).format("YYYY-MM-DD")
    };
    await models.SecretaryAdminCm.update(body, {where: {id: admin_id}});
    return res.sendData(null, "Update success!");
};

router.postS("/update-admin-club/:admin_id", updateAdmin, false);
router.getS("/get-all-admin", getAllAdmin, false);
router.postS("/list-admin", lists, false);
router.getS("/search", search, false);
router.getS("/detail", detail, true);
router.postS("/remove-admin-club/:admin_id", remove, false);
router.postS("/verify-captcha", verifyCaptcha, false);
router.postS("/token", token, false);

module.exports = router;
