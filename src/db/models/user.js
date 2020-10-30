export default (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    gender: {
      type: DataTypes.ENUM,
      values: ["male", "female"],
    },
    role: {
      type: DataTypes.ENUM,
      values: ["buyer", "vendor", "admin"],
      defaultValue: "buyer",
    },
    passkey: DataTypes.STRING,
  });
  User.associate = function (models) {
    User.hasMany(models.Item, {
      foreignKey: "id",
    });
    User.hasOne(models.Cart, {
      foreignKey: "id",
    });
  };
  return User;
};
