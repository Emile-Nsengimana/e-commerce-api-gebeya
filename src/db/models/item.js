export default (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.FLOAT,
    photo: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: ["available", "sold", "expired"],
      defaultValue: "available",
    },
    quantity: DataTypes.INTEGER,
    vendorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
  Item.associate = function (models) {
    Item.belongsTo(models.User, {
      as: "vendor",
      foreignKey: "vendorId",
      onDelete: "CASCADE",
    });
  };
  return Item;
};
