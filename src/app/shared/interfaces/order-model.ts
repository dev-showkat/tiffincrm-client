export interface OrderModel {
      user: String,
      orderAddress: String,
      orderAmount: Number,
      orderMode: String,
      orderCatagory: Array<any>
      orderItems: Array<any>,
      orderPaymentMode: String,
      orderInstructions: String,
      orderDeliveryTime: String,
      orderType: String,
      orderPaymentStatus: String
}
