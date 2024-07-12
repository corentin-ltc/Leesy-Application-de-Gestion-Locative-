
export interface Rental {
    id: number;
    rental_name: string;
    rental_city: string;
    rental_postal_code: string,
    number_of_tenants: number;
    country: string,
    surface_area: number,
    rental_type: number,
    user_id: number;
}

export interface Tenant {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    email_address: string;
    rent_amount: number;
    charges: number;
    security_deposit: number;
    additional_info: string;
    move_in_date: string;
    rent_payment_date: string;
    rental_id: number;
    city: string; // Assuming this is included in your tenant data
  }
  