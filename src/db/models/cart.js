"use strict";
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define(
    "Cart",
    {
      products: DataTypes.JSON,
      totalPrice: DataTypes.FLOAT,
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {}
  );
  Cart.associate = function (models) {
    // associations can be defined here
    Cart.belongsTo(models.User, {
      as: "buyer",
      foreignKey: "buyerId",
      onDelete: "CASCADE",
    });
  };
  return Cart;
};
