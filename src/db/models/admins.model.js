const Sequelize = require("sequelize");
module.exports = function(sequelize, DataTypes) {
    const Admin = sequelize.define(
        "admins",
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
            last_activity: {
                type: DataTypes.DATE,
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
            remember_token: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            token_login: {
                type: DataTypes.STRING(100),
                allowNull: true,
                comment: "token của chủ câu lạc bộ"
            },
            token_cms_api: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            birthday: {
                type: DataTypes.DATEONLY,
                allowNull: true
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
            vgs_admin: {
                type: DataTypes.TINYINT,
                allowNull: false,
                defaultValue: 0
            },
            tag_color: {
                type: DataTypes.STRING(50),
                allowNull: true
            },
            permission_club: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            is_only_tournament: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            token_device: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            region: {
                type: DataTypes.TINYINT.UNSIGNED,
                allowNull: true
            }
        },
        {
            sequelize,
            tableName: "admins",
            timestamps: true,
            underscored: true,
            paranoid: true,

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
    return Admin;
};
