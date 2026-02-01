export class WompiWebhookDto {
  data: {
    transaction: {
      id: string;
      origin: string | null;
      status: string;
      currency: string;
      reference: string;
      created_at: string;
      billing_data: {
        legal_id: string;
        legal_id_type: string;
      };
      finalized_at: string;
      redirect_url: string | null;
      customer_data: {
        device_id: string;
        full_name: string;
        browser_info: any;
        phone_number: string;
        device_data_token: string;
      };
      customer_email: string;
      payment_method: {
        type: string;
        extra: any;
        token: string;
        installments: number;
        is_click_to_pay: boolean;
      };
      status_message: string | null;
      amount_in_cents: number;
      payment_link_id: string;
      shipping_address: any;
      payment_source_id: string | null;
      payment_method_type: string;
      // Campo SKU para identificar la cuota o matrícula
      // Formato: "cuota:{cuotaId}" o "matricula:{matriculaId}"
      sku?: string;
    };
  };
  event: string;
  sent_at: string;
  signature: {
    checksum: string;
    properties: string[];
  };
  timestamp: number;
  environment: string;
}
