PGDMP      4            
    |            cex    17.0    17.0 ;    G           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            H           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            I           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            J           1262    16388    cex    DATABASE     w   CREATE DATABASE cex WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Russian_Russia.1252';
    DROP DATABASE cex;
                     postgres    false                        3079    16437    timescaledb 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS timescaledb WITH SCHEMA public;
    DROP EXTENSION timescaledb;
                        false            K           0    0    EXTENSION timescaledb    COMMENT     }   COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data (Community Edition)';
                             false    2                       1259    17191    order    TABLE     '  CREATE TABLE public."order" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    order_type character varying(10) NOT NULL,
    currency character varying(10) NOT NULL,
    quantity numeric(18,8) NOT NULL,
    price numeric(18,8) NOT NULL,
    "timestamp" timestamp without time zone
);
    DROP TABLE public."order";
       public         heap r       postgres    false                       1259    17190    order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.order_id_seq;
       public               postgres    false    283            L           0    0    order_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.order_id_seq OWNED BY public."order".id;
          public               postgres    false    282                       1259    17168    user    TABLE     �   CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying(80) NOT NULL,
    password_hash character varying(256) NOT NULL,
    email character varying(120) NOT NULL,
    is_verified boolean
);
    DROP TABLE public."user";
       public         heap r       postgres    false                       1259    17167    user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.user_id_seq;
       public               postgres    false    279            M           0    0    user_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;
          public               postgres    false    278                       1259    17179    wallet    TABLE     �   CREATE TABLE public.wallet (
    id integer NOT NULL,
    user_id integer NOT NULL,
    currency character varying(10) NOT NULL,
    balance numeric(18,8),
    is_hot boolean
);
    DROP TABLE public.wallet;
       public         heap r       postgres    false                       1259    17178    wallet_id_seq    SEQUENCE     �   CREATE SEQUENCE public.wallet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.wallet_id_seq;
       public               postgres    false    281            N           0    0    wallet_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.wallet_id_seq OWNED BY public.wallet.id;
          public               postgres    false    280            A           2604    17194    order id    DEFAULT     f   ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);
 9   ALTER TABLE public."order" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    282    283    283            ?           2604    17171    user id    DEFAULT     d   ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);
 8   ALTER TABLE public."user" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    279    278    279            @           2604    17182 	   wallet id    DEFAULT     f   ALTER TABLE ONLY public.wallet ALTER COLUMN id SET DEFAULT nextval('public.wallet_id_seq'::regclass);
 8   ALTER TABLE public.wallet ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    280    281    281                      0    16458 
   hypertable 
   TABLE DATA           
  COPY _timescaledb_catalog.hypertable (id, schema_name, table_name, associated_schema_name, associated_table_prefix, num_dimensions, chunk_sizing_func_schema, chunk_sizing_func_name, chunk_target_size, compression_state, compressed_hypertable_id, status) FROM stdin;
    _timescaledb_catalog               postgres    false    227   ZC                 0    16528    chunk 
   TABLE DATA           �   COPY _timescaledb_catalog.chunk (id, hypertable_id, schema_name, table_name, compressed_chunk_id, dropped, status, osm_chunk, creation_time) FROM stdin;
    _timescaledb_catalog               postgres    false    235   wC                 0    16587    chunk_column_stats 
   TABLE DATA           �   COPY _timescaledb_catalog.chunk_column_stats (id, hypertable_id, chunk_id, column_name, range_start, range_end, valid) FROM stdin;
    _timescaledb_catalog               postgres    false    240   �C                 0    16494 	   dimension 
   TABLE DATA           �   COPY _timescaledb_catalog.dimension (id, hypertable_id, column_name, column_type, aligned, num_slices, partitioning_func_schema, partitioning_func, interval_length, compress_interval_length, integer_now_func_schema, integer_now_func) FROM stdin;
    _timescaledb_catalog               postgres    false    231   �C                 0    16513    dimension_slice 
   TABLE DATA           a   COPY _timescaledb_catalog.dimension_slice (id, dimension_id, range_start, range_end) FROM stdin;
    _timescaledb_catalog               postgres    false    233   �C                 0    16553    chunk_constraint 
   TABLE DATA           �   COPY _timescaledb_catalog.chunk_constraint (chunk_id, dimension_slice_id, constraint_name, hypertable_constraint_name) FROM stdin;
    _timescaledb_catalog               postgres    false    236   �C                 0    16570    chunk_index 
   TABLE DATA           o   COPY _timescaledb_catalog.chunk_index (chunk_id, index_name, hypertable_id, hypertable_index_name) FROM stdin;
    _timescaledb_catalog               postgres    false    238   D       '          0    16766    compression_chunk_size 
   TABLE DATA           :  COPY _timescaledb_catalog.compression_chunk_size (chunk_id, compressed_chunk_id, uncompressed_heap_size, uncompressed_toast_size, uncompressed_index_size, compressed_heap_size, compressed_toast_size, compressed_index_size, numrows_pre_compression, numrows_post_compression, numrows_frozen_immediately) FROM stdin;
    _timescaledb_catalog               postgres    false    257   %D       &          0    16756    compression_settings 
   TABLE DATA           y   COPY _timescaledb_catalog.compression_settings (relid, segmentby, orderby, orderby_desc, orderby_nullsfirst) FROM stdin;
    _timescaledb_catalog               postgres    false    256   BD                  0    16676    continuous_agg 
   TABLE DATA             COPY _timescaledb_catalog.continuous_agg (mat_hypertable_id, raw_hypertable_id, parent_mat_hypertable_id, user_view_schema, user_view_name, partial_view_schema, partial_view_name, direct_view_schema, direct_view_name, materialized_only, finalized) FROM stdin;
    _timescaledb_catalog               postgres    false    249   _D       (          0    16782    continuous_agg_migrate_plan 
   TABLE DATA           ~   COPY _timescaledb_catalog.continuous_agg_migrate_plan (mat_hypertable_id, start_ts, end_ts, user_view_definition) FROM stdin;
    _timescaledb_catalog               postgres    false    258   |D       )          0    16791     continuous_agg_migrate_plan_step 
   TABLE DATA           �   COPY _timescaledb_catalog.continuous_agg_migrate_plan_step (mat_hypertable_id, step_id, status, start_ts, end_ts, type, config) FROM stdin;
    _timescaledb_catalog               postgres    false    260   �D       !          0    16703    continuous_aggs_bucket_function 
   TABLE DATA           �   COPY _timescaledb_catalog.continuous_aggs_bucket_function (mat_hypertable_id, bucket_func, bucket_width, bucket_origin, bucket_offset, bucket_timezone, bucket_fixed_width) FROM stdin;
    _timescaledb_catalog               postgres    false    250   �D       $          0    16736 +   continuous_aggs_hypertable_invalidation_log 
   TABLE DATA           �   COPY _timescaledb_catalog.continuous_aggs_hypertable_invalidation_log (hypertable_id, lowest_modified_value, greatest_modified_value) FROM stdin;
    _timescaledb_catalog               postgres    false    253   �D       "          0    16716 &   continuous_aggs_invalidation_threshold 
   TABLE DATA           h   COPY _timescaledb_catalog.continuous_aggs_invalidation_threshold (hypertable_id, watermark) FROM stdin;
    _timescaledb_catalog               postgres    false    251   �D       %          0    16740 0   continuous_aggs_materialization_invalidation_log 
   TABLE DATA           �   COPY _timescaledb_catalog.continuous_aggs_materialization_invalidation_log (materialization_id, lowest_modified_value, greatest_modified_value) FROM stdin;
    _timescaledb_catalog               postgres    false    254   E       #          0    16726    continuous_aggs_watermark 
   TABLE DATA           _   COPY _timescaledb_catalog.continuous_aggs_watermark (mat_hypertable_id, watermark) FROM stdin;
    _timescaledb_catalog               postgres    false    252   *E                 0    16663    metadata 
   TABLE DATA           R   COPY _timescaledb_catalog.metadata (key, value, include_in_telemetry) FROM stdin;
    _timescaledb_catalog               postgres    false    247   GE                 0    16480 
   tablespace 
   TABLE DATA           V   COPY _timescaledb_catalog.tablespace (id, hypertable_id, tablespace_name) FROM stdin;
    _timescaledb_catalog               postgres    false    229   �E                 0    16607    bgw_job 
   TABLE DATA             COPY _timescaledb_config.bgw_job (id, application_name, schedule_interval, max_runtime, max_retries, retry_period, proc_schema, proc_name, owner, scheduled, fixed_schedule, initial_start, hypertable_id, config, check_schema, check_name, timezone) FROM stdin;
    _timescaledb_config               postgres    false    242   �E       D          0    17191    order 
   TABLE DATA           b   COPY public."order" (id, user_id, order_type, currency, quantity, price, "timestamp") FROM stdin;
    public               postgres    false    283   F       @          0    17168    user 
   TABLE DATA           Q   COPY public."user" (id, username, password_hash, email, is_verified) FROM stdin;
    public               postgres    false    279   +F       B          0    17179    wallet 
   TABLE DATA           H   COPY public.wallet (id, user_id, currency, balance, is_hot) FROM stdin;
    public               postgres    false    281   WG       O           0    0    chunk_column_stats_id_seq    SEQUENCE SET     V   SELECT pg_catalog.setval('_timescaledb_catalog.chunk_column_stats_id_seq', 1, false);
          _timescaledb_catalog               postgres    false    239            P           0    0    chunk_constraint_name    SEQUENCE SET     R   SELECT pg_catalog.setval('_timescaledb_catalog.chunk_constraint_name', 1, false);
          _timescaledb_catalog               postgres    false    237            Q           0    0    chunk_id_seq    SEQUENCE SET     I   SELECT pg_catalog.setval('_timescaledb_catalog.chunk_id_seq', 1, false);
          _timescaledb_catalog               postgres    false    234            R           0    0 ,   continuous_agg_migrate_plan_step_step_id_seq    SEQUENCE SET     i   SELECT pg_catalog.setval('_timescaledb_catalog.continuous_agg_migrate_plan_step_step_id_seq', 1, false);
          _timescaledb_catalog               postgres    false    259            S           0    0    dimension_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('_timescaledb_catalog.dimension_id_seq', 1, false);
          _timescaledb_catalog               postgres    false    230            T           0    0    dimension_slice_id_seq    SEQUENCE SET     S   SELECT pg_catalog.setval('_timescaledb_catalog.dimension_slice_id_seq', 1, false);
          _timescaledb_catalog               postgres    false    232            U           0    0    hypertable_id_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('_timescaledb_catalog.hypertable_id_seq', 1, false);
          _timescaledb_catalog               postgres    false    226            V           0    0    bgw_job_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('_timescaledb_config.bgw_job_id_seq', 1000, false);
          _timescaledb_config               postgres    false    241            W           0    0    order_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.order_id_seq', 1, false);
          public               postgres    false    282            X           0    0    user_id_seq    SEQUENCE SET     9   SELECT pg_catalog.setval('public.user_id_seq', 2, true);
          public               postgres    false    278            Y           0    0    wallet_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.wallet_id_seq', 1, false);
          public               postgres    false    280            �           2606    17196    order order_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_pkey;
       public                 postgres    false    283            �           2606    17177    user user_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_email_key;
       public                 postgres    false    279            �           2606    17173    user user_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public                 postgres    false    279            �           2606    17175    user user_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_username_key;
       public                 postgres    false    279            �           2606    17184    wallet wallet_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.wallet
    ADD CONSTRAINT wallet_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.wallet DROP CONSTRAINT wallet_pkey;
       public                 postgres    false    281            �           2606    17197    order order_user_id_fkey    FK CONSTRAINT     z   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
 D   ALTER TABLE ONLY public."order" DROP CONSTRAINT order_user_id_fkey;
       public               postgres    false    279    283    5271            �           2606    17185    wallet wallet_user_id_fkey    FK CONSTRAINT     z   ALTER TABLE ONLY public.wallet
    ADD CONSTRAINT wallet_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(id);
 D   ALTER TABLE ONLY public.wallet DROP CONSTRAINT wallet_user_id_fkey;
       public               postgres    false    281    5271    279                  x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �      '      x������ � �      &      x������ � �             x������ � �      (      x������ � �      )      x������ � �      !      x������ � �      $      x������ � �      "      x������ � �      %      x������ � �      #      x������ � �         }   x��K
� @ѱ����>il�R�O̇Ĕ.���;8ܺ=�z��yS���M�&rv��?�T���Mr
ُ�.
-�U���ֽK�Y���&F�#y�����G�:���� W'L            x������ � �            x������ � �      D      x������ � �      @     x�e��NBA@���9X�v�v�e��0��S���δCH�����K\���;�]N>.�����gu�u�:~��r�9�q
����������� ��D�X���D�����D��J/�:�!�SK-P���X2I�I�"Y�E���`vi	��h�(غ6�����pٯ;�lg�k�Н�t�x������<������#�
�U��މ��Zs�rCj�Jk�P)Fh��n��~'b�����3<4p�;ɠjԄ9Bb
�zᚫ"�� �N�?�_��d���r      B      x������ � �     