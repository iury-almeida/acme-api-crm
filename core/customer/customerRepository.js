'use strict';

const db = require('../../config/database');

module.exports = {
    create,
    update,
    select,
    selectById
}

async function create(params) {

    try {

        let result = await db.query(`
            INSERT INTO crm.customer(
                name, 
                haveallreadybought, 
                inactive, 
                occurredat
            )
            VALUES(
                '${params.name}', 
                ${params.haveAllreadyBought || false}, 
                ${params.inactive || false},
                (to_timestamp(${Date.now()} / 1000))
            )
            RETURNING id;
        `);

        //link and adding customer adresses
        let adressResult;

        for (let i = 0; i < params.adress.length; i++) {

            adressResult = await db.query(`
                INSERT INTO crm.adress(
                    street, 
                    neighborhood,
                    "number",
                    complement,
                    cep,
                    city,
                    country,
                    main
                )
                VALUES(
                    '${params.adress[i].street}',
                    '${params.adress[i].neighborhood}',
                    ${+params.adress[i].number},
                    '${params.adress[i].complement || ''}',
                    ${+params.adress[i].cep},
                    '${params.adress[i].city}',
                    '${params.adress[i].country}',
                    ${params.adress[i].main || false}
                )

                RETURNING id;
            `);

            await db.query(`
                INSERT INTO crm.customeradress(
                    idcustomer,
                    idadress
                )
                VALUES(
                    ${+result.rows[0].id},
                    ${+adressResult.rows[0].id}
                )
            `)

        };

        //link and adding customer email

        let emailResult;

        for (let i = 0; i < params.email.length; i++) {

            emailResult = await db.query(`
                INSERT INTO crm.email(
                    email,
                    main
                )
                VALUES(
                    '${params.email[i].email}',
                    ${params.email[i].main || false}
                )
                RETURNING id;
            `);

            await db.query(`
                INSERT INTO crm.customeremail(
                    idcustomer,
                    idemail
                )
                VALUES(
                    ${+result.rows[0].id},
                    ${+emailResult.rows[0].id}
                )
            `)

        };

        //link and adding customer telephone

        let telephoneResult;

        for (let i = 0; i < params.telephone.length; i++) {

            telephoneResult = await db.query(`
                INSERT INTO crm.telephone(
                    countryarea,
                    "number",
                    main
                )
                VALUES(
                    ${+params.telephone[i].countryArea},
                    ${+params.telephone[i].number},
                    ${params.telephone[i].main || false}
                )
                RETURNING id;
            `);

            await db.query(`
                INSERT INTO crm.customertelephone(
                    idcustomer,
                    idtelephone
                )
                VALUES(
                    ${+result.rows[0].id},
                    ${+telephoneResult.rows[0].id}
                )
            `)

        };

        return result.rows[0];
    } catch (error) {
        return error;
    }
}

async function update(params) {
    try {

        await db.query(`
            UPDATE crm.customer
            SET
                name = '${params.name}',
                haveallreadybought = ${params.haveAllreadyBought},
                inactive = ${params.inactive}
            WHERE id = ${params.id};    
        `);

        //link and adding customer adresses which is not in db 
        let adressResult;

        for (let i = 0; i < params.adress.length; i++) {

            if (!params.adress[i].id) {

                adressResult = await db.query(`
                    INSERT INTO crm.adress(
                        street, 
                        neighborhood,
                        number,
                        complement,
                        cep,
                        city,
                        country,
                        main
                    )
                    VALUES(
                        '${params.adress[i].street}',
                        '${params.adress[i].neighborhood}',
                        ${params.adress[i].number},
                        '${params.adress[i].complement || ''}',
                        ${params.adress[i].cep},
                        '${params.adress[i].city}',
                        '${params.adress[i].country}',
                        ${params.adress[i].main || false}
                    )

                    RETURNING id;
                `);
                params.adress[i].id = adressResult.rows[0].id;

                await db.query(`
                    INSERT INTO crm.customeradress(
                        idcustomer,
                        idadress
                    )
                    VALUES(
                        ${params.id},
                        ${+adressResult.rows[0].id}
                    )
                `)
            }
            else {
                await db.query(`
                    UPDATE crm.adress
                    SET 
                        street = '${params.adress[i].street}',
                        neighborhood = '${params.adress[i].neighborhood}',
                        number = ${params.adress[i].number},
                        complement = '${params.adress[i].complement}',
                        cep = ${params.adress[i].cep},
                        city = '${params.adress[i].city}',
                        country = '${params.adress[i].country}',
                        main = '${params.adress[i].main}'
                    WHERE id = ${params.adress[i].id}
                `)
            }

        };

        //unlinking customer adresses 
        let adressIds = [];

        params.adress.map(x => {
            adressIds.push(x.id);
        });

        await db.query(`
            DELETE FROM crm.customeradress 
            WHERE idcustomer = ${params.id} AND idadress NOT IN (${adressIds});
        `);

        //link and adding customer email which is not in db

        let emailResult;

        for (let i = 0; i < params.email.length; i++) {

            if (!params.email[i].id) {

                emailResult = await db.query(`
                    INSERT INTO crm.email(
                        email,
                        main
                    )
                    VALUES(
                        '${params.email[i].email}',
                        ${params.email[i].main || false}
                    )
                    RETURNING id;
                `);

                params.email[i].id = adressResult.rows[0].id;

                await db.query(`
                    INSERT INTO crm.customeremail(
                        idcustomer,
                        idemail
                    )
                    VALUES(
                        ${+params.id},
                        ${+emailResult.rows[0].id}
                    )
                `);
            }
            else {
                await db.query(`
                    UPDATE crm.email
                    SET 
                        email = '${params.email[i].email}',
                        main = '${params.email[i].main}'
                    WHERE id  = ${params.email[i].id}
                `);
            }
        };

         //unlinking customer emails
         let emailIds = [];

         params.email.map(x => {
             emailIds.push(x.id);
         });

         await db.query(`
             DELETE FROM crm.customeremail 
             WHERE idcustomer = ${params.id} AND idemail NOT IN (${emailIds});
         `);

        //link and adding customer telephone which is not in db

        let telephoneResult;

        for (let i = 0; i < params.telephone.length; i++) {

            if (!params.telephone[i].id) {

                telephoneResult = await db.query(`
                    INSERT INTO crm.telephone(
                        countryarea,
                        "number",
                        main
                    )
                    VALUES(
                        ${+params.telephone[i].countryArea},
                        ${+params.telephone[i].number},
                        ${params.telephone[i].main || false}
                    )
                    RETURNING id;
                `);

                params.telephone[i].id = adressResult.rows[0].id;

                await db.query(`
                    INSERT INTO crm.customertelephone(
                        idcustomer,
                        idtelephone
                    )
                    VALUES(
                        ${+params.id},
                        ${+telephoneResult.rows[0].id}
                    )
                `);
            }

            else {
                await db.query(`
                    UPDATE crm.telephone
                    SET 
                        countryarea = ${params.telephone[i].countryArea},
                        "number" = ${params.telephone[i].number},
                        main = ${params.telephone[i].main}
                    WHERE id  = ${params.telephone[i].id}
                `);
            }
        }

        //unlinking customer telephones
        let telephoneIds = [];

        params.telephone.map(x => {
            telephoneIds.push(x.id);
        });

        await db.query(`
            DELETE FROM crm.customertelephone 
            WHERE idcustomer = ${params.id} AND idtelephone NOT IN (${telephoneIds});
        `);

        return params.id;
    
    } catch (error) {
        return error;
    }
}

async function select(params) {
    try {
        let result = await db.query(
            `
            SELECT 
                c.id,
                c.name,
                c.haveallreadybought AS "haveAllreadyBought",
                c.inactive,
                c.occurredat
            FROM crm.customer c
            ORDER BY id asc
        `
        );

        return result.rows;
    } catch (error) {
        return error;
    }
}

async function selectById(params) {
    try {
        let result = await db.query(
            `
            SELECT 
                c.id,
                c.name,
                c.haveallreadybought AS "haveAllreadyBought",
                c.inactive,
                c.occurredat,
                (SELECT json_agg(x) as adress FROM(
                    SELECT DISTINCT
                        a.id,
                        a.street,
                        a.neighborhood,
                        a.number,
                        a.complement,
                        a.cep,
                        a.city,
                        a.country,
                        a.main
                    FROM crm.adress a
                    INNER JOIN crm.customeradress ca
                        ON ca.idadress = a.id
                    INNER JOIN crm.customer c
                        ON ${params.id} = ca.idcustomer
                )x),
                (SELECT json_agg(x) as email FROM(
                    SELECT DISTINCT
                        e.id,
                        e.email,
                        e.main
                    FROM crm.email e
                    INNER JOIN crm.customeremail ce
                        ON ce.idemail = e.id
                    INNER JOIN crm.customer c
                        ON ${params.id} = ce.idcustomer
                )x),
                (SELECT json_agg(x) as telephone FROM(
                    SELECT DISTINCT
                        t.id,
                        t.countryarea AS "countryArea",
                        t.number,
                        t.main 
                    FROM crm.telephone t
                    INNER JOIN crm.customertelephone ct
                        ON ct.idtelephone = t.id
                    INNER JOIN crm.customer c
                        ON ${params.id} = ct.idcustomer
                )x)
            FROM crm.customer c
            WHERE c.id = ${params.id}
        `
        );

        return result.rows[0];
    } catch (error) {
        return error;
    }
}
