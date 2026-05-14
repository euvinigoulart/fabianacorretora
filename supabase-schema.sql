-- Copie e cole este código no SQL Editor do Supabase (https://supabase.com/dashboard/project/.../sql/new) e clique em "Run"

-- Criação da tabela de propriedades
CREATE TABLE public.properties (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  location text NOT NULL,
  price text NOT NULL,
  beds integer DEFAULT 0,
  baths integer DEFAULT 0,
  bathrooms integer DEFAULT 0,
  garages integer DEFAULT 0,
  has_bbq boolean DEFAULT false,
  has_pool boolean DEFAULT false,
  has_laundry boolean DEFAULT false,
  area text NOT NULL,
  image text NOT NULL,
  gallery text[] DEFAULT '{}',
  tag text DEFAULT '',
  type text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criação da tabela de configurações
CREATE TABLE public.settings (
  id integer PRIMARY KEY DEFAULT 1,
  admin_user text DEFAULT 'admin',
  admin_pass text DEFAULT '1234',
  hero_img text,
  about_img text,
  cta_img text,
  footer_logo_img text,
  profile_img text,
  watermark_img text
);

-- Insere as configurações iniciais
INSERT INTO public.settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Criação do bucket de imagens, caso não exista (requer permissões que a UI faz melhor, mas podemos usar SQL)
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

-- Configurar permissões públicas para visualizar e fazer upload nas imagens
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Public Insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');

-- Adicionando políticas para garantir que todas as tabelas possam ser lidas/escritas por anonimamente (modo fácil de admin)
-- ATENÇÃO: em um ambiente de produção real você deve usar Supabase Auth em vez de anon para modificar os dados.
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users on properties" ON public.properties FOR ALL USING (true);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users on settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Enable all access for all users on settings" ON public.settings FOR ALL USING (true);
