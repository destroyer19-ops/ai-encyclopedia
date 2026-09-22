-- Create the has_role RPC function for Supabase
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean AS $$
DECLARE
    role_exists boolean;
BEGIN
    SELECT EXISTS(
        SELECT 1 FROM public.user_roles 
        WHERE user_id = _user_id AND role = _role
    ) INTO role_exists;
    
    RETURN role_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
