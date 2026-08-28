export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      aac_reference: {
        Row: {
          aac: number | null
          aac_date: string
          created_at: string
          dataset_version_id: string | null
          drug_name: string | null
          id: string
          imported_at: string | null
          ndc: string
          source_file: string | null
          updated_at: string
        }
        Insert: {
          aac?: number | null
          aac_date: string
          created_at?: string
          dataset_version_id?: string | null
          drug_name?: string | null
          id?: string
          imported_at?: string | null
          ndc: string
          source_file?: string | null
          updated_at?: string
        }
        Update: {
          aac?: number | null
          aac_date?: string
          created_at?: string
          dataset_version_id?: string | null
          drug_name?: string | null
          id?: string
          imported_at?: string | null
          ndc?: string
          source_file?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "aac_reference_dataset_version_id_fkey"
            columns: ["dataset_version_id"]
            isOneToOne: false
            referencedRelation: "reference_dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts: {
        Row: {
          created_at: string
          id: string
          name: string
          owner_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          owner_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          owner_user_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      apa_memberships: {
        Row: {
          created_at: string
          discount_redeemed: boolean
          discount_redeemed_at: string | null
          discount_redeemed_business_id: string | null
          first_name: string
          id: string
          last_name: string
          license_number: string
          membership: string
          membership_expires: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          discount_redeemed?: boolean
          discount_redeemed_at?: string | null
          discount_redeemed_business_id?: string | null
          first_name: string
          id?: string
          last_name: string
          license_number: string
          membership: string
          membership_expires?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          discount_redeemed?: boolean
          discount_redeemed_at?: string | null
          discount_redeemed_business_id?: string | null
          first_name?: string
          id?: string
          last_name?: string
          license_number?: string
          membership?: string
          membership_expires?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string | null
          created_at: string
          field_name: string | null
          id: string
          ip_address: string | null
          new_value: string | null
          old_value: string | null
          record_id: string | null
          table_name: string | null
          updated_at: string
          user_agent: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          action?: string | null
          created_at?: string
          field_name?: string | null
          id?: string
          ip_address?: string | null
          new_value?: string | null
          old_value?: string | null
          record_id?: string | null
          table_name?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          action?: string | null
          created_at?: string
          field_name?: string | null
          id?: string
          ip_address?: string | null
          new_value?: string | null
          old_value?: string | null
          record_id?: string | null
          table_name?: string | null
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      businesses: {
        Row: {
          account_id: string
          activation_key: string | null
          address: string | null
          address_line2: string | null
          business_email: string | null
          city: string | null
          contact_person: string | null
          contact_person_last_name: string | null
          country: string | null
          created_at: string
          date_of_registration: string | null
          email: string | null
          fax: string | null
          ghl_company_id: string | null
          ghl_contact_id: string | null
          has_used_trial: boolean
          id: string
          mobile_number: string | null
          ncpdp: string
          npi: string
          pharmacist_license: string | null
          pharmacy_license_number: string | null
          pharmacy_name: string
          pharmacy_slug: string | null
          pharmacy_software_system: string | null
          phone: string | null
          preferred_contact_method: string | null
          role_in_pharmacy: string | null
          state: string | null
          status: string
          stripe_customer_id: string | null
          time_zone: string | null
          updated_at: string
          website_url: string | null
          zip: string | null
        }
        Insert: {
          account_id: string
          activation_key?: string | null
          address?: string | null
          address_line2?: string | null
          business_email?: string | null
          city?: string | null
          contact_person?: string | null
          contact_person_last_name?: string | null
          country?: string | null
          created_at?: string
          date_of_registration?: string | null
          email?: string | null
          fax?: string | null
          ghl_company_id?: string | null
          ghl_contact_id?: string | null
          has_used_trial?: boolean
          id?: string
          mobile_number?: string | null
          ncpdp: string
          npi: string
          pharmacist_license?: string | null
          pharmacy_license_number?: string | null
          pharmacy_name: string
          pharmacy_slug?: string | null
          pharmacy_software_system?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          role_in_pharmacy?: string | null
          state?: string | null
          status?: string
          stripe_customer_id?: string | null
          time_zone?: string | null
          updated_at?: string
          website_url?: string | null
          zip?: string | null
        }
        Update: {
          account_id?: string
          activation_key?: string | null
          address?: string | null
          address_line2?: string | null
          business_email?: string | null
          city?: string | null
          contact_person?: string | null
          contact_person_last_name?: string | null
          country?: string | null
          created_at?: string
          date_of_registration?: string | null
          email?: string | null
          fax?: string | null
          ghl_company_id?: string | null
          ghl_contact_id?: string | null
          has_used_trial?: boolean
          id?: string
          mobile_number?: string | null
          ncpdp?: string
          npi?: string
          pharmacist_license?: string | null
          pharmacy_license_number?: string | null
          pharmacy_name?: string
          pharmacy_slug?: string | null
          pharmacy_software_system?: string | null
          phone?: string | null
          preferred_contact_method?: string | null
          role_in_pharmacy?: string | null
          state?: string | null
          status?: string
          stripe_customer_id?: string | null
          time_zone?: string | null
          updated_at?: string
          website_url?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      ful_reference: {
        Row: {
          aca_ful: number | null
          created_at: string
          dataset_version_id: string | null
          drug_name: string | null
          id: string
          imported_at: string | null
          month: number
          ndc: string
          source_file: string | null
          updated_at: string
          year: number
        }
        Insert: {
          aca_ful?: number | null
          created_at?: string
          dataset_version_id?: string | null
          drug_name?: string | null
          id?: string
          imported_at?: string | null
          month: number
          ndc: string
          source_file?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          aca_ful?: number | null
          created_at?: string
          dataset_version_id?: string | null
          drug_name?: string | null
          id?: string
          imported_at?: string | null
          month?: number
          ndc?: string
          source_file?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "ful_reference_dataset_version_id_fkey"
            columns: ["dataset_version_id"]
            isOneToOne: false
            referencedRelation: "reference_dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      pbm_info: {
        Row: {
          bin: string
          created_at: string
          dataset_version_id: string | null
          email: string | null
          id: string
          imported_at: string | null
          matching_type: string
          pbm_key: string | null
          pbm_name: string | null
          pcn: string | null
          source_file: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          bin: string
          created_at?: string
          dataset_version_id?: string | null
          email?: string | null
          id?: string
          imported_at?: string | null
          matching_type: string
          pbm_key?: string | null
          pbm_name?: string | null
          pcn?: string | null
          source_file?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          bin?: string
          created_at?: string
          dataset_version_id?: string | null
          email?: string | null
          id?: string
          imported_at?: string | null
          matching_type?: string
          pbm_key?: string | null
          pbm_name?: string | null
          pcn?: string | null
          source_file?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pbm_info_dataset_version_id_fkey"
            columns: ["dataset_version_id"]
            isOneToOne: false
            referencedRelation: "reference_dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      pending_registrations: {
        Row: {
          activation_key: string | null
          activation_link_sent_at: string | null
          activation_token: string | null
          activation_token_expires_at: string | null
          address: string | null
          address_line2: string | null
          business_id: string | null
          city: string | null
          contact_person: string | null
          contact_person_last_name: string | null
          country: string | null
          created_at: string
          desktop_username: string | null
          email: string
          fax: string | null
          id: string
          is_desktop_converter: boolean
          mobile_number: string | null
          ncpdp: string
          npi: string
          pharmacist_license: string | null
          pharmacy_license_number: string | null
          pharmacy_name: string | null
          pharmacy_software_system: string | null
          phone: string | null
          role_in_pharmacy: string | null
          state: string | null
          status: string
          updated_at: string
          verification_notes: string | null
          verified_at: string | null
          verified_by_user_id: string | null
          website_url: string | null
          zip: string | null
        }
        Insert: {
          activation_key?: string | null
          activation_link_sent_at?: string | null
          activation_token?: string | null
          activation_token_expires_at?: string | null
          address?: string | null
          address_line2?: string | null
          business_id?: string | null
          city?: string | null
          contact_person?: string | null
          contact_person_last_name?: string | null
          country?: string | null
          created_at?: string
          desktop_username?: string | null
          email: string
          fax?: string | null
          id?: string
          is_desktop_converter?: boolean
          mobile_number?: string | null
          ncpdp: string
          npi: string
          pharmacist_license?: string | null
          pharmacy_license_number?: string | null
          pharmacy_name?: string | null
          pharmacy_software_system?: string | null
          phone?: string | null
          role_in_pharmacy?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by_user_id?: string | null
          website_url?: string | null
          zip?: string | null
        }
        Update: {
          activation_key?: string | null
          activation_link_sent_at?: string | null
          activation_token?: string | null
          activation_token_expires_at?: string | null
          address?: string | null
          address_line2?: string | null
          business_id?: string | null
          city?: string | null
          contact_person?: string | null
          contact_person_last_name?: string | null
          country?: string | null
          created_at?: string
          desktop_username?: string | null
          email?: string
          fax?: string | null
          id?: string
          is_desktop_converter?: boolean
          mobile_number?: string | null
          ncpdp?: string
          npi?: string
          pharmacist_license?: string | null
          pharmacy_license_number?: string | null
          pharmacy_name?: string | null
          pharmacy_software_system?: string | null
          phone?: string | null
          role_in_pharmacy?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          verification_notes?: string | null
          verified_at?: string | null
          verified_by_user_id?: string | null
          website_url?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pending_registrations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      reference_dataset_versions: {
        Row: {
          checksum: string | null
          created_at: string
          dataset_name: string
          id: string
          latest_upload_at: string | null
          row_count: number | null
          updated_at: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          dataset_name: string
          id?: string
          latest_upload_at?: string | null
          row_count?: number | null
          updated_at?: string
        }
        Update: {
          checksum?: string | null
          created_at?: string
          dataset_name?: string
          id?: string
          latest_upload_at?: string | null
          row_count?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      report_files: {
        Row: {
          business_id: string
          created_at: string
          file_name: string | null
          generated_at: string | null
          generated_by_user_id: string | null
          id: string
          report_type: string | null
          storage_path: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          file_name?: string | null
          generated_at?: string | null
          generated_by_user_id?: string | null
          id?: string
          report_type?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          file_name?: string | null
          generated_at?: string | null
          generated_by_user_id?: string | null
          id?: string
          report_type?: string | null
          storage_path?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "report_files_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          account_id: string
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          id: string
          promotion_code: string | null
          status: string | null
          stripe_checkout_session_id: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end_date: string | null
          updated_at: string
        }
        Insert: {
          account_id: string
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          promotion_code?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string | null
          updated_at?: string
        }
        Update: {
          account_id?: string
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          id?: string
          promotion_code?: string | null
          status?: string | null
          stripe_checkout_session_id?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_businesses: {
        Row: {
          business_id: string
          created_at: string
          id: string
          is_primary: boolean
          joined_at: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          joined_at?: string
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          joined_at?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_businesses_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_data: {
        Row: {
          aac_date_used: string | null
          acq: number | null
          acq_net: number | null
          authorization_number: string | null
          awp: number | null
          bin: string | null
          business_id: string
          compound: string | null
          created_at: string
          customer_group_number: string | null
          customer_id: string | null
          customer_name: string | null
          date_dispensed: string | null
          day_supply: number | null
          difference: number | null
          drug_340b: string | null
          drug_name: string | null
          drug_ndc: string | null
          drug_preferred_vendor: string | null
          expected_paid: number | null
          first_name: string | null
          ful_month_used: number | null
          ful_year_used: number | null
          gpi: string | null
          group_field: string | null
          id: string
          insurance: string | null
          insurance_rejection_codes: string | null
          last_name: string | null
          medicaid_method: string | null
          medicaid_rate: number | null
          medicaid_rate_calculated_at: string | null
          medicaid_rate_original: number | null
          nadac: number | null
          new_owed: number | null
          new_paid: number | null
          owed: number | null
          payer_type: string | null
          payment: number | null
          pbm_key: string | null
          pcn: string | null
          primary_network_reimbursement_id: string | null
          qty: number | null
          rate_source: string | null
          script: string | null
          script_pcn: string | null
          source_file: string | null
          status: string | null
          total_paid: number | null
          updated_at: string
          wac_date_used: string | null
        }
        Insert: {
          aac_date_used?: string | null
          acq?: number | null
          acq_net?: number | null
          authorization_number?: string | null
          awp?: number | null
          bin?: string | null
          business_id: string
          compound?: string | null
          created_at?: string
          customer_group_number?: string | null
          customer_id?: string | null
          customer_name?: string | null
          date_dispensed?: string | null
          day_supply?: number | null
          difference?: number | null
          drug_340b?: string | null
          drug_name?: string | null
          drug_ndc?: string | null
          drug_preferred_vendor?: string | null
          expected_paid?: number | null
          first_name?: string | null
          ful_month_used?: number | null
          ful_year_used?: number | null
          gpi?: string | null
          group_field?: string | null
          id?: string
          insurance?: string | null
          insurance_rejection_codes?: string | null
          last_name?: string | null
          medicaid_method?: string | null
          medicaid_rate?: number | null
          medicaid_rate_calculated_at?: string | null
          medicaid_rate_original?: number | null
          nadac?: number | null
          new_owed?: number | null
          new_paid?: number | null
          owed?: number | null
          payer_type?: string | null
          payment?: number | null
          pbm_key?: string | null
          pcn?: string | null
          primary_network_reimbursement_id?: string | null
          qty?: number | null
          rate_source?: string | null
          script?: string | null
          script_pcn?: string | null
          source_file?: string | null
          status?: string | null
          total_paid?: number | null
          updated_at?: string
          wac_date_used?: string | null
        }
        Update: {
          aac_date_used?: string | null
          acq?: number | null
          acq_net?: number | null
          authorization_number?: string | null
          awp?: number | null
          bin?: string | null
          business_id?: string
          compound?: string | null
          created_at?: string
          customer_group_number?: string | null
          customer_id?: string | null
          customer_name?: string | null
          date_dispensed?: string | null
          day_supply?: number | null
          difference?: number | null
          drug_340b?: string | null
          drug_name?: string | null
          drug_ndc?: string | null
          drug_preferred_vendor?: string | null
          expected_paid?: number | null
          first_name?: string | null
          ful_month_used?: number | null
          ful_year_used?: number | null
          gpi?: string | null
          group_field?: string | null
          id?: string
          insurance?: string | null
          insurance_rejection_codes?: string | null
          last_name?: string | null
          medicaid_method?: string | null
          medicaid_rate?: number | null
          medicaid_rate_calculated_at?: string | null
          medicaid_rate_original?: number | null
          nadac?: number | null
          new_owed?: number | null
          new_paid?: number | null
          owed?: number | null
          payer_type?: string | null
          payment?: number | null
          pbm_key?: string | null
          pcn?: string | null
          primary_network_reimbursement_id?: string | null
          qty?: number | null
          rate_source?: string | null
          script?: string | null
          script_pcn?: string | null
          source_file?: string | null
          status?: string | null
          total_paid?: number | null
          updated_at?: string
          wac_date_used?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_data_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      wac_reference: {
        Row: {
          created_at: string
          dataset_version_id: string | null
          drug_name: string | null
          effective_date: string
          generic_indicator: string | null
          id: string
          imported_at: string | null
          ndc: string
          pkg_size: number | null
          pkg_size_mult: number | null
          source_file: string | null
          updated_at: string
          wac: number | null
        }
        Insert: {
          created_at?: string
          dataset_version_id?: string | null
          drug_name?: string | null
          effective_date: string
          generic_indicator?: string | null
          id?: string
          imported_at?: string | null
          ndc: string
          pkg_size?: number | null
          pkg_size_mult?: number | null
          source_file?: string | null
          updated_at?: string
          wac?: number | null
        }
        Update: {
          created_at?: string
          dataset_version_id?: string | null
          drug_name?: string | null
          effective_date?: string
          generic_indicator?: string | null
          id?: string
          imported_at?: string | null
          ndc?: string
          pkg_size?: number | null
          pkg_size_mult?: number | null
          source_file?: string | null
          updated_at?: string
          wac?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "wac_reference_dataset_version_id_fkey"
            columns: ["dataset_version_id"]
            isOneToOne: false
            referencedRelation: "reference_dataset_versions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "superadmin" | "admin" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["superadmin", "admin", "member"],
    },
  },
} as const
