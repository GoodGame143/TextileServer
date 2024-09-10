select * from sscc;
select * from sscc_v2;

create TABLE sscc(
        id VARCHAR(50),
        id_change CHAR,
        id_controler INTEGER,
        id_machine INTEGER,
        deviation_percent NUMERIC(4,3),
        ddate VARCHAR(10),
        ttime VARCHAR(10),
        sort CHAR,
        parent_sscc INTEGER,
        child_sscc INTEGER UNIQUE,
        quantity_meters_real NUMERIC(7,1),
        quantity_meters_final NUMERIC(7,1),
        cuts INTEGER null,
        cutouts_quantity INTEGER null,
        cutouts_meters NUMERIC(2,1) null,
        defect_code INTEGER,
        flag_print CHAR 
);
create TABLE sscc_v2(
        id VARCHAR(50),
        id_change CHAR,
        id_controler INTEGER,
        id_machine INTEGER,
        deviation_percent NUMERIC(4,3),
        ddate VARCHAR(10),
        ttime VARCHAR(10),
        sort CHAR,
        parent_sscc INTEGER,
        child_sscc INTEGER UNIQUE,
        quantity_meters_real NUMERIC(7,1),
        quantity_meters_final NUMERIC(7,1),
        cuts INTEGER null,
        cutouts_quantity INTEGER null,
        cutouts_meters NUMERIC(2,1) null,
        defect_code INTEGER,
        flag_print CHAR  
);
create TABLE sscc_v3(
        id VARCHAR(50),
        id_change CHAR,
        id_controler INTEGER,
        id_machine INTEGER,
        deviation_percent NUMERIC(4,3),
        ddate VARCHAR(10),
        ttime VARCHAR(10),
        sort CHAR,
        parent_sscc INTEGER,
        child_sscc INTEGER UNIQUE,
        quantity_meters_real NUMERIC(7,1),
        quantity_meters_final NUMERIC(7,1),
        cuts INTEGER null,
        cutouts_quantity INTEGER null,
        cutouts_meters NUMERIC(2,1) null,
        defect_code INTEGER,
        flag_print CHAR  
);

create TABLE sscc_roll(
        roll INTEGER UNIQUE
);
create table scalling_factor(
        id_controler integer,
        id_machine integer,
        ddate varchar(10),
        ttime varchar(10),
        scal numeric(20,19) -- = 0.1234567890123456789 (lenght) id_controler, id_machine, ddate, ttime, scal
);
CREATE TABLE trim(
        parent_sscc INTEGER,
        sort char,
        q_trim smallint,
        m_trim NUMERIC(3,1)
);
CREATE TABLE trim_v2(
        parent_sscc INTEGER,
        sort char,
        q_trim smallint,
        m_trim NUMERIC(3,1)
);
drop table sscc;
drop table sscc_v2;
drop table sscc_flap;
drop table sscc_flap_v2;
