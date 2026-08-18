// ===========================================================================
// Seed data for Sefunmi's Properties.
//
// This is the same CSV content as the files in /data, embedded here as text
// so the database loads instantly with no network requests -- and so the app
// works when opened as local files (fetch() is blocked on file:// URLs).
//
// TO CHANGE THE STARTING DATA: edit the CSV text below (keep the header row),
// then use "Reset database to CSV seed" in the admin panel.
// ===========================================================================
const SEED_CSV = {
  owners: `owner_id,name,email,phone
1,Julia Martinez,julia.martinez@pandpmail.com,(202) 555-0142
2,Marcus Webb,marcus.webb@pandpmail.com,(202) 555-0177
3,Adaeze Okonkwo,a.okonkwo@pandpmail.com,(202) 555-0193
4,Grace Chen,grace.chen@pandpmail.com,(202) 555-0118
5,Samuel Torres,s.torres@pandpmail.com,(202) 555-0164`,
  properties: `property_id,address,city,state,zip,type,bedrooms,bathrooms,rent,owner_id,listed_date,status
1,101 Elm Court,Oak Park,IL,60301,Townhouse,3,2.5,2150,1,2025-03-14,Occupied
2,88 Maple Ridge Dr,Maplewood,NJ,07040,Single Family,4,3,3100,1,2025-05-02,Occupied
3,412 Birchwood Ln,Oak Park,IL,60302,Condo,2,2,1650,2,2025-06-21,Vacant
4,7 Cedar Hollow,Maplewood,NJ,07040,Single Family,3,2,2450,2,2024-11-09,Occupied
5,250 Willow Bend Apt 4B,Bloomington,IN,47401,Apartment,1,1,975,3,2026-01-15,Occupied
6,19 Juniper Way,Bloomington,IN,47404,Duplex,2,1.5,1280,3,2026-02-28,Vacant
7,3300 Sycamore Blvd,Indianapolis,IN,46220,Apartment,2,2,1420,4,2025-08-30,Occupied
8,55 Aspen Circle,Indianapolis,IN,46208,Townhouse,3,2.5,1890,4,2025-09-12,Occupied
9,908 Magnolia St,Oak Park,IL,60304,Single Family,5,3.5,3750,5,2024-07-19,Occupied
10,140 Poplar Terrace,Maplewood,NJ,07040,Condo,2,1,1550,5,2026-04-06,Vacant
11,66 Hawthorne Ct,Bloomington,IN,47403,Single Family,4,2.5,2280,1,2025-12-01,Occupied
12,21 Chestnut Row,Indianapolis,IN,46225,Loft,1,1,1150,2,2026-03-22,Vacant`,
  tenants: `tenant_id,name,email,phone,property_id,move_in_date
1,Emily Jones,emily.jones@mailbox.com,(312) 555-0102,1,2025-04-01
2,David Okafor,d.okafor@mailbox.com,(973) 555-0155,2,2025-06-01
3,Priya Raman,priya.raman@mailbox.com,(973) 555-0188,4,2024-12-01
4,Tomas Nowak,t.nowak@mailbox.com,(812) 555-0121,5,2026-02-01
5,Aisha Bello,aisha.bello@mailbox.com,(317) 555-0139,7,2025-10-01
6,Kevin Park,kevin.park@mailbox.com,(317) 555-0147,8,2025-10-15
7,Renee Duval,renee.duval@mailbox.com,(312) 555-0166,9,2024-08-15
8,Ola Adeyemi,ola.adeyemi@mailbox.com,(812) 555-0173,11,2026-01-05`,
  employees: `employee_id,name,role,email,phone
1,Hussein El-Masri,Leasing Agent,h.elmasri@sefunmiproperties.com,(202) 888-4501
2,Nina Patel,Property Manager,n.patel@sefunmiproperties.com,(202) 888-4502
3,Carlos Rivera,Maintenance Lead,c.rivera@sefunmiproperties.com,(202) 888-4503
4,Dana Whitfield,Leasing Agent,d.whitfield@sefunmiproperties.com,(202) 888-4504`,
  leases: `lease_id,property_id,tenant_id,employee_id,start_date,end_date,monthly_rent,deposit
1,1,1,1,2025-04-01,2026-03-31,2150,2150
2,2,2,1,2025-06-01,2026-05-31,3100,3100
3,4,3,2,2024-12-01,2026-11-30,2450,2450
4,5,4,4,2026-02-01,2027-01-31,975,975
5,7,5,2,2025-10-01,2026-09-30,1420,1420
6,8,6,4,2025-10-15,2026-10-14,1890,1890
7,9,7,1,2024-08-15,2026-08-14,3750,3750
8,11,8,3,2026-01-05,2027-01-04,2280,2280`,
  payments: `payment_id,lease_id,tenant_id,payment_date,amount,method,status
1,1,1,2025-04-02,2150,Bank Transfer,On time
2,1,1,2025-05-02,2150,Bank Transfer,On time
3,1,1,2025-06-07,2150,Check,Late
4,1,1,2025-07-07,2150,Check,Late
5,1,1,2025-08-07,2150,Check,Late
6,1,1,2025-09-02,2150,Bank Transfer,On time
7,1,1,2025-10-02,2150,Bank Transfer,On time
8,1,1,2025-11-02,2150,Check,On time
9,1,1,2025-12-02,2150,Check,On time
10,1,1,2026-01-02,2150,Bank Transfer,On time
11,2,2,2025-06-02,3100,Check,On time
12,2,2,2025-07-02,3100,Check,On time
13,2,2,2025-08-02,3100,Bank Transfer,On time
14,2,2,2025-09-02,3100,Bank Transfer,On time
15,2,2,2025-10-02,3100,Bank Transfer,On time
16,2,2,2025-11-02,3100,Bank Transfer,On time
17,2,2,2025-12-02,3100,Check,On time
18,2,2,2026-01-02,3100,Check,On time
19,2,2,2026-02-02,3100,Check,On time
20,2,2,2026-03-02,3100,Bank Transfer,On time
21,3,3,2024-12-02,2450,Check,On time
22,3,3,2025-01-02,2450,Check,On time
23,3,3,2025-02-07,2450,Bank Transfer,Late
24,3,3,2025-03-02,2450,Check,On time
25,3,3,2025-04-02,2450,Card,On time
26,3,3,2025-05-02,2450,Card,On time
27,3,3,2025-06-02,2450,Bank Transfer,On time
28,3,3,2025-07-02,2450,Check,On time
29,3,3,2025-08-02,2450,Bank Transfer,On time
30,3,3,2025-09-02,2450,Check,On time
31,4,4,2026-02-02,975,Card,On time
32,4,4,2026-03-02,975,Card,On time
33,4,4,2026-04-02,975,Bank Transfer,On time
34,4,4,2026-05-07,975,Card,Late
35,4,4,2026-06-02,975,Card,On time
36,4,4,2026-07-02,975,Card,On time
37,4,4,2026-08-02,975,Check,On time
38,5,5,2025-10-07,1420,Check,Late
39,5,5,2025-11-02,1420,Card,On time
40,5,5,2025-12-02,1420,Card,On time
41,5,5,2026-01-02,1420,Check,On time
42,5,5,2026-02-02,1420,Bank Transfer,On time
43,5,5,2026-03-02,1420,Card,On time
44,5,5,2026-04-02,1420,Check,On time
45,5,5,2026-05-07,1420,Check,Late
46,5,5,2026-06-02,1420,Check,On time
47,5,5,2026-07-02,1420,Check,On time
48,6,6,2025-10-02,1890,Card,On time
49,6,6,2025-11-02,1890,Check,On time
50,6,6,2025-12-02,1890,Card,On time
51,6,6,2026-01-02,1890,Check,On time
52,6,6,2026-02-07,1890,Bank Transfer,Late
53,6,6,2026-03-02,1890,Card,On time
54,6,6,2026-04-02,1890,Bank Transfer,On time
55,6,6,2026-05-02,1890,Card,On time
56,6,6,2026-06-07,1890,Card,Late
57,6,6,2026-07-02,1890,Card,On time
58,7,7,2024-08-02,3750,Card,On time
59,7,7,2024-09-02,3750,Card,On time
60,7,7,2024-10-02,3750,Card,On time
61,7,7,2024-11-02,3750,Card,On time
62,7,7,2024-12-02,3750,Bank Transfer,On time
63,7,7,2025-01-07,3750,Bank Transfer,Late
64,7,7,2025-02-02,3750,Bank Transfer,On time
65,7,7,2025-03-07,3750,Check,Late
66,7,7,2025-04-02,3750,Card,On time
67,7,7,2025-05-07,3750,Card,Late
68,8,8,2026-01-02,2280,Check,On time
69,8,8,2026-02-02,2280,Bank Transfer,On time
70,8,8,2026-03-02,2280,Check,On time
71,8,8,2026-04-02,2280,Check,On time
72,8,8,2026-05-02,2280,Bank Transfer,On time
73,8,8,2026-06-02,2280,Check,On time
74,8,8,2026-07-02,2280,Card,On time
75,8,8,2026-08-02,2280,Card,On time`
};
