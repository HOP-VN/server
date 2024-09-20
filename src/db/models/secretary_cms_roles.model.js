module.exports = function(sequelize, DataTypes) {
  const SecretaryCmsRole = sequelize.define('secretary_cms_roles', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    desc: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    guard_name: {
      type: DataTypes.STRING(191),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'secretary_cms_roles',
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  return SecretaryCmsRole;
};
