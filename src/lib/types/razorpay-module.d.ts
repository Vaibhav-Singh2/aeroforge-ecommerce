declare module "razorpay" {
  interface RazorpayOrderApi {
    create(options: unknown): Promise<any>;
  }

  interface RazorpayInstance {
    orders: RazorpayOrderApi;
  }

  class Razorpay implements RazorpayInstance {
    constructor(options: { key_id: string; key_secret: string });

    orders: RazorpayOrderApi;
  }

  export default Razorpay;
}
