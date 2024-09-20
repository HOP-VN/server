const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    const SecretaryAdminCm = sequelize.define(
        "secretary_admin_cms",
        {
            id: {
                autoIncrement: true,
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
                primaryKey: true
            },
            facility_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(191),
                allowNull: false
            },
            avatar: {
                type: DataTypes.STRING(500),
                allowNull: true
            },
            title: {
                type: DataTypes.STRING(191),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(191),
                allowNull: true
            },
            password: {
                type: DataTypes.STRING(191),
                allowNull: false
            },
            permission: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            level: {
                type: DataTypes.TINYINT.UNSIGNED,
                allowNull: false
            },
            is_active: {
                type: DataTypes.TINYINT,
                allowNull: true,
                defaultValue: 0
            },
            phone: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: "",
                unique: "phone"
            },
            type_admin: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0,
                comment: "0: admin bt; 1: admin booking: 2 admin  sport"
            },
            permission_club: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            region: {
                type: DataTypes.TINYINT.UNSIGNED,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: "secretary_admin_cms",
            timestamps: true,
            underscored: true,
            paranoid: true, //deleted_at

            indexes: [
                {
                    name: "PRIMARY",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "id" }
                    ]
                },
                {
                    name: "phone",
                    unique: true,
                    using: "BTREE",
                    fields: [
                        { name: "phone" }
                    ]
                }
            ]
        }
    );

    SecretaryAdminCm.associate = (models) => {
        SecretaryAdminCm.belongsToMany(models.SecretaryCmsRole, {
            as: "role_admin",
            through: models.SecretaryCmsModelHasRole,
            foreignKey: "model_id",
            otherKey: "role_id"
        });
    };

    return SecretaryAdminCm;
};
