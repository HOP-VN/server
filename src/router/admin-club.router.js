const router = require('./extensions').Router();
const models = router.models;
const { isEmpty } = require('../lib/validate');
const { Op } = require('sequelize');
const { ThrowReturn } = require('./extensions');
const moment = require('moment');

const searchAdminClub = async (req, res) => {
    let { keyword, limit, page } = req.query;
    if (isEmpty(limit)) limit = 20;
    if (isEmpty(page)) page = 1;

    const listData = await models.AdminClub.findAll({
        where: {
            name: {
                [Op.like]: `%${keyword}%`,
            },
            is_public: 1
        },
        attributes: ['id', 'name', 'type_club'],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return res.sendData(listData);
};

const list = async (req, res) => {
    let { name, limit, page, admin_cms_id } = req.query;
    if (isEmpty(limit)) limit = 20;
    if (isEmpty(page)) page = 1;
    const { count, rows } = await models.AdminClub.findAndCountAll({
        where: {
            [Op.and]: [
                name ? { name: { [Op.substring]: name } } : {},
                admin_cms_id ? { admin_cms_id } : {},
            ],
        },
        order: [['updated_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
    });

    return res.sendData({ data: rows, total: count });
};

const detail = async (req, res) => {
    const data = await models.AdminClub.findOne({ where: { id: req.params.id } });
    return res.sendData(data);
};

const list_member = async (req, res) => {
    let { limit, page, user_id } = req.query;
    if (isEmpty(limit)) limit = 20;
    if (isEmpty(page)) page = 1;
    const club = await models.AdminClub.findOne({
        where: { id: req.params.id },
    });

    if (!isEmpty(club)) {
        const { count, rows } = await models.UserClubMember.findAndCountAll({
            include: [{ model: models.User, as: 'user', attributes: ['id', 'fullname'] },
            ],
            where: { club_id: club.id },
            order: [
                ['is_user_admin', 'DESC'],
                ['is_vice_president', 'DESC'],
                ['is_captain', 'DESC'],
                ['is_general_secretary', 'DESC'],
                ['is_moderator', 'DESC'],
                ['updated_at', 'DESC'],
            ],
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
        });
        return res.sendData({ data: rows, total: count });
    }
    return res.sendData({ data: [], total: 0 });
};

const change_status_public = async (req, res) => {
    const update = await models.AdminClub.update({ is_public: req.body.is_hidden }, {
        where: { id: req.params.id },
    });
    if (update) {
        return res.sendData('Đổi trạng thái thành công');
    }
    throw new ThrowReturn('Đổi trạng thái thất bại');
};
const store = async (req, res) => {
    const body = req.body;
    const data = await models.AdminClub.create({
        title: body.title,
        logo_url_path: body.logo_url_path,
        name: body.name,
        address: body.address,
        about: body.about,
        is_public: 0,
        date_birthday: moment(body.date_birthday).format('YYYY-MM-DD HH:mm:ss'),
        admin_cms_id: body.admin_cms_id,
    });
    if (data) {
        return res.sendData('Thêm mới thành công');
    }
    throw new ThrowReturn('Thêm mới thất bại');
};

const update = async (req, res) => {
    const body = req.body;
    const update = await models.AdminClub.update({
        title: body.title,
        logo_url_path: body.logo_url_path,
        name: body.name,
        address: body.address,
        about: body.about,
        is_public: 0,
        date_birthday: moment(body.date_birthday).format('YYYY-MM-DD HH:mm:ss'),
        admin_cms_id: body.admin_cms_id,
    }, {
        where: { id: req.params.id },
    });
    return res.sendData('Cập nhật thành công');
};
const add_user_club = async (req, res) => {
    let { id } = req.params;
    let { listGolfers } = req.body;
    if (isEmpty(id) || isEmpty(listGolfers)) throw new ThrowReturn('data missing !! ');
    try {
        for (item of listGolfers) {
            const user = await models.UserClubMember.findOne({ where: { club_id: id, user_id: item.id } });
            if (isEmpty(user)) {
                const data = await models.UserClubMember.create({
                    user_id: item.id,
                    club_id: id,
                    is_user_admin: item.position.includes(1) ? 1 : 0,
                    is_vice_president: item.position.includes(2) ? 1 : 0,
                    is_captain: item.position.includes(3) ? 1 : 0,
                    is_general_secretary: item.position.includes(4) ? 1 : 0,
                    is_moderator: item.position.includes(5) ? 1 : 0,
                });
            }
        }
        return res.sendData('Thêm thành viên thành công !!!');
    } catch (err) {
        throw new ThrowReturn('Thêm thành viên thất bại !!!', err);
    }
};

const list_club_id = async (req, res) => {
    const data = await models.AdminClub.findAll({
        attributes: ['id', 'name'],
        where: { is_public: 1 },
        order: [['id', 'DESC']],
        limit: null,
        offset: null,
    });

    return res.sendData(data);
};
const list_member_id = async (req, res) => {

    const club = await models.AdminClub.findOne({
        where: { id: req.params.id },
    });

    if (!isEmpty(club)) {
        const data = await models.UserClubMember.findAll({
            where: { club_id: club.id },
            attributes: ['id'],
            limit: null,
            offset: null,
        });
        return res.sendData(data);
    }
    return res.sendData({ data: [], total: 0 });
};
router.getS('/search', searchAdminClub, false);
router.getS('/list', list, false);
router.getS('/list_member/:id', list_member, false);
router.postS('/change_status_public/:id', change_status_public, false);
router.postS('/store', store, false);
router.postS('/update/:id', update, false);
router.postS('/detail/:id', detail, false);
router.postS('/add_user_club/:id', add_user_club, false);

//voucher
router.getS('/list_club_id', list_club_id, false);
router.getS('/list_member_id/:id', list_member_id, false);
module.exports = router;
