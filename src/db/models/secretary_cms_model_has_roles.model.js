const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const  SecretaryCmsModelHasRole = sequelize.define('secretary_cms_model_has_roles', {
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'secretary_cms_roles',
        key: 'id'
      }
    },
    model_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    model_type: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'secretary_cms_model_has_roles',
    timestamps: false,
    underscored: true,

    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "role_id" },
          { name: "model_id" },
        ]
      },
      {
        name: "secretary_cms_model_has_roles_model_id_model_type_index",
        using: "BTREE",
        fields: [
          { name: "model_id" },
          { name: "model_type" },
        ]
      },
    ]
  });
  
  return SecretaryCmsModelHasRole;
};
