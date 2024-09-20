const router = require('./extensions').Router();
const models = router.models;
const {Op} = require('sequelize');
const {isEmpty,validateData} = require('../lib/validate');
const {ThrowReturn} = require('./extensions');

const lists = async (req, res) => {
  let { limit, page, title, name } = req.body;
  if (isEmpty(limit)) limit = 10;
  if (isEmpty(page)) page = 1;
  const { count, rows }  = await models.SecretaryCmsRole.findAndCountAll({
      order: [["created_at", "DESC"]],
      where: {
        [Op.and]: [
         name ?  {  name: {[Op.substring]: name}} : {},
          title ? { title: {[Op.substring]: title }} : {},
        ],
      },
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    })
    return res.sendData({ data: rows, total: count });
};

const getAllRole = async (req, res) => {
  const roles = await models.SecretaryCmsRole.findAll();
  res.sendData(roles);
}

const getAllRoleClub = async (req, res) => {
  const roles = await models.SecretaryCmsRole.findAll();
  res.sendData(roles);
}

const create = async (req, res) => {
    const { name, title } = req.body;
    let keyValidate = {
        "title": "required|type:text|min:0|max:100",
        "name": "required|type:text|min:0|max:100",
    };
    let isCheckValid = validateData(keyValidate, req.body);
    if (!isCheckValid.status) {
      throw new ThrowReturn(isCheckValid.message);
    }
    const createdRole = await models.SecretaryCmsRole.findOrCreate({
      where: { name },
      defaults: { name, title, guard_name :"web" },
    });
    if (!createdRole[1]) throw new ThrowReturn('Quyền đã tồn tại');

    res.sendData(null, "Thêm thành công")
}

const update = async (req, res) => {
    const { name, title, id } = req.body;
    const conflictRole = await models.SecretaryCmsRole.findOne({ where: { name, id: { [Op.not]: id } } });
    if (conflictRole) throw new ThrowReturn("Slug đã được sử dụng")
    const updatedRole = await models.SecretaryCmsRole.update({ name, title }, { where: { id } });
    if (updatedRole[0] === 0) throw new ThrowReturn('Quyền đã tồn tại');

    res.sendData(null, "Sửa thành công")
}

const remove = async (req, res) => {
    const { id } = req.params;
    await models.SecretaryCmsRole.destroy({ where: { id } });
    return res.sendData(null, "Xóa thành công");
};

const getRoleUnder = async (req, res) => {
  const {currentAdmin} = req
  const currentAdminRole = await models.AdminCm.findAll({
      where: {id: currentAdmin.id},
      attributes: ['roles.level', 'roles.type_services'],
      include: {model: models.Role, attributes: [], as: 'roles', through: {attributes: []}},
      raw: true,
  })
  const roleLevel = currentAdminRole.map((r) => r.level)
  let listRole = []
  if (roleLevel.includes(1)) {
      listRole = await models.Role.findAll({where: {level: {[Op.gt]: 1}}})
  } else {
      for (const r of currentAdminRole) {
          const list = await models.Role.findAll({where: {[Op.and]: [{level: {[Op.gt]: r.level}}, {type_services: r.type_services}]}})
          listRole = [...listRole, ...list]
      }
  }

  res.sendData(listRole)
}

router.postS('/get-list-role',lists, false)
router.postS('/get-all-role',getAllRole, false)
router.postS('/get-all-role-club',getAllRoleClub, false)
router.postS('/create', create, false)
router.postS('/update', update, false)
router.getS('/remove/:id', remove, false)

module.exports = router;
