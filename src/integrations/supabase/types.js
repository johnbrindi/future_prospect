// This is a JavaScript representation of the original TypeScript types
// Note that JavaScript doesn't have type definitions, so this is just
// documentation of the expected database structure

/*
Database Structure:
{
  public: {
    Tables: {
      applications: {
        columns: {
          cover_letter: string | null
          created_at: string
          id: string
          internship_id: string
          notes: string | null
          resume_url: string | null
          status: string
          student_id: string
        }
        relationships: [
          {
            foreignKey: "applications_internship_id_fkey"
            references: "internships" table "id" column
          },
          {
            foreignKey: "applications_student_id_fkey"
            references: "students" table "id" column
          }
        ]
      },
      companies: {
        columns: {
          about: string
          created_at: string
          id: string
          industry: string
          location: string
          logo_url: string | null
          name: string
          user_id: string
          website: string | null
        }
      },
      internships: {
        columns: {
          company_id: string
          created_at: string
          deadline: string | null
          description: string
          duration: string
          id: string
          is_active: boolean
          location: string
          requirements: string[] | null
          responsibilities: string[] | null
          title: string
          type: string
        }
        relationships: [
          {
            foreignKey: "internships_company_id_fkey"
            references: "companies" table "id" column
          }
        ]
      },
      messages: {
        columns: {
          content: string
          created_at: string
          id: string
          read: boolean
          receiver_id: string
          sender_id: string
        }
      },
      profiles: {
        columns: {
          created_at: string
          id: string
          type: string
          user_id: string
        }
      },
      students: {
        columns: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department: string
          full_name: string
          graduation_year: string | null
          id: string
          resume_url: string | null
          skills: string[] | null
          university: string
          user_id: string
        }
      }
    },
    Functions: {
      allow_profile_insert: (user_id_param: string) => void,
      bypass_rls_for_profile_creation: (uid: string, profile_type: string) => string,
      create_storage_bucket: (bucket_id: string, bucket_public?: boolean) => void,
      execute_schema_sql: () => void,
      fix_profiles_rls_policy: () => void,
      fix_rls_policies_direct_sql: () => void
    }
  }
}
*/

// Constants object that can be used in JavaScript
export const Constants = {
  public: {
    Enums: {},
  },
};