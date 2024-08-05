const { response } = require('express')
const db = require('../dbsll')
const axios = require('axios')
const min = 3
const max = 8
//var key = 0n
const p = 100
const g = 4
const key_m = 37n
var flag = false

const username = "******";
const password = "*****";
let url = '*****'

const authToken = btoa(`${username}:${password}`);
const config = {
  headers: {
    'Authorization': `Basic ${authToken}`,
    'Content-Type': 'application/json'
  },
};

class PostController{
  async record_roll(req, res) {
    const ip = req.ip
    const {roll} = req.body;
    try {
      const sqlQuery = "INSERT INTO sscc_roll(roll) VALUES ($1) RETURNING *";
      const values = [roll];
      const result_roll = await db.query(sqlQuery, values);
      console.log(`Запрос c: ${req.ip.replace('::ffff:','')} - на запись ролика: `, parseInt([roll]), `| Ответ: ok - Ролик успешно принят и записан в БД :)`)

      res.json({ "status" : "ok" })
    } catch (error) {
      console.error(error)
      console.log(`Запрос c : ${req.ip.replace('::ffff:','')}  - на запись ролика: `, parseInt([roll]), ` | Ответ: NullPointerExteption - Проверьте пожалуйста, номер ролика и повторите попытку снова :)`) 
      res.json({ "status" : "no" })
    }
    
  }
  
async key_DiffieHellman(req, res) {
  const st = Math.floor(Math.random() * (max - min + 1)) + min 
  const key_client = parseInt(req.body.key_client) 
    const my_key = (Math.pow(g, st)) % p
    key = Math.pow(key_client, st) % p 
    st2 = st     
    console.log(st, key_client, key)
    res.json({ "key": my_key })
}

async filed_to_good(req, res) {
  
  try {
    const failedQueries = await db.query('SELECT * FROM sscc_v2');
    for (const query of failedQueries.rows) {
      const {id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print} = query;
      const data = {
        id: id,
        id_change: id_change,
        id_controler: id_controler,
        id_machine: id_machine,
        deviation_percent: deviation_percent,
        ddate: ddate,
        ttime: ttime,
        sort: sort,
        parent_sscc: parent_sscc,
        child_sscc: child_sscc,
        quantity_meters_real: quantity_meters_real,
        quantity_meters_final: quantity_meters_final,
        cuts: cuts,
        cutouts_quantity: cutouts_quantity,
        cutouts_meters: cutouts_meters,
        defect_code: defect_code,
        flag_print: flag_print
      };
    const values = [id, id_change, id_controler.toString(), id_machine.toString(), deviation_percent, ddate, ttime, sort, parent_sscc.toString(), child_sscc.toString(), quantity_meters_real, quantity_meters_final, cuts.toString(), cutouts_quantity.toString(), cutouts_meters, defect_code.toString(), flag_print];
    try {
        const response = await axios.post(url, data, config);
        if (response.status === 200) {
          const sqlQuery = "INSERT INTO sscc (id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
          await db.query(sqlQuery, values)
          await db.query('DELETE FROM sscc_v2 WHERE child_sscc = $1', [child_sscc]);
          var sort_for_console = "";
          switch (sort) {
            case '1':
              sort_for_console = "Первый сорт"
              break;
            case '2':
              sort_for_console = "Второй сорт"
              break;
            case '3':
              sort_for_console = "Мерный"
              break;
            case '4':
              sort_for_console = "Весовой"
              break;
            case '5':
              sort_for_console = "Переправа"
              break;
            default:
              break;
          }
          console.log(response.status,`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ - Кусок успешно принят на сервере 1С, а так же перезаписан в локальную БД(sscc). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
          flag = false;
        }
      } 
      catch (error) {
        console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,' & Ответ - Не удалось отправить неудачный запрос. Info:', "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final]);
        flag = true;
      }
    }
  } 
  catch (error) { console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,'& Ответ - Не удалось извлечь данные из таблицы sscc_v2 и повторно отправить(ОШИБКА ИЗВЛЕЧЕНИЯ ДАННЫХ)')}
  try {
    const failedQueries = await db.query('SELECT * FROM sscc_flap_v2');
    for (const query of failedQueries.rows) {
      const {id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, defect_code, flag_print} = query;
      const data = {
        id: id,
        id_change: id_change,
        id_controler: id_controler,
        id_machine: id_machine,
        deviation_percent: deviation_percent,
        ddate: ddate,
        ttime: ttime,
        sort: sort,
        parent_sscc: parent_sscc,
        child_sscc: child_sscc,
        quantity_meters_real: quantity_meters_real,
        quantity_meters_final: quantity_meters_final,
        defect_code: defect_code,
        flag_print: flag_print
    };
    const values = [id, id_change, id_controler.toString(), id_machine.toString(), deviation_percent, ddate, ttime, sort, parent_sscc.toString(), child_sscc.toString(), quantity_meters_real, quantity_meters_final, defect_code.toString(), flag_print];
    
    try {
        const response = await axios.post(url, data, config);
        if (response.status === 200) {
          const sqlQuery = "INSERT INTO sscc_flap (id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *";
          await db.query(sqlQuery, values)
          await db.query('DELETE FROM sscc_flap_v2 WHERE child_sscc = $1', [child_sscc]);
          console.log(response.status, `Запрос на запись c: ${req.ip.replace('::ffff:','')}`," & Ответ - Кусок успешно принят на сервере 1С, а так же перезаписан в локальную БД(sscc_flap). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
          flag_flap = false;
        }
      } 
      catch (error) {
        console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,' & Ответ - Не удалось отправить неудачный запрос. Info:', "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final]);
        flag_flap = true;
      }
    }
  } 
  catch (error) { console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,'Ответ - Не удалось извлечь данные из таблицы sscc_flap_v2 и повторно отправить(ОШИБКА ИЗВЛЕЧЕНИЯ ДАННЫХ)')}
  res.status(200).send("OK")
}

async changeLinkLocal(req, res){
  url = '*****'
  res.status(200).send("OK local")
}
async changeLinkGlobal(req, res){
  url = '*****'
  res.status(200).send("OK global")
}
async changeLinkLocalt4(req, res){
  url = '*****'
  res.status(200).send("OK local")
}
async changeLinkGlobalt4(req, res){
  url = '*****'
  res.status(200).send("OK global")
}
async createPost_m(req, res) {
  const ddate = getDate()
  const ttime = getTime()
  var result2 = '';
  try {
    result2 = req.body;    
    for (let i = 0; i < result2.length; i++) {
      let charCode = BigInt(result2.charCodeAt(i));
      let xorResult = charCode ^ BigInt(key_m);
      let xorString = xorResult.toString();
      result2 = result2.slice(0, i) + String.fromCharCode(Number(xorString)) + result2.slice(i + 1);
    }   
  const result3 = JSON.parse(result2)  
  const {id, id_change, id_controler, id_machine, deviation_percent, scal, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print} = result3;
  const values = [id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print];
  const scalling = await db.query("INSERT INTO scalling_factor(id_controler, id_machine, ddate, ttime, scal) VALUES ($1, $2, $3, $4, $5) RETURNING*",[id_controler, id_machine, ddate, ttime, scal])
  const sqlQuerySearchChild = await db.query("SELECT * FROM sscc WHERE child_sscc = $1 LIMIT 1", [child_sscc]);
  const sqlQuerySearchChild_v2 = await db.query("SELECT * FROM sscc_v2 WHERE child_sscc = $1 LIMIT 1", [child_sscc]);
  if(sqlQuerySearchChild.rows.length > 0 || sqlQuerySearchChild_v2.rows.length > 0){
    res.status(200).send({"status" : "q"})
    console.log(`Запрос c: ${req.ip.replace('::ffff:','')} на поиск КУСКА: `, parseInt([child_sscc]), ` & Ответ: "q" - Такой кусок к сожалению уже есть в БД, рекомендуется использовать другой номер куска :)`) 
    //console.log()
  }
  else {
    res.status(200).send({"status" : "1"})  
    console.log(`Запрос c: ${req.ip.replace('::ffff:','')} на поиск КУСКА:`, parseInt([child_sscc]), ` & Ответ: "w" - Куска с таким номером благополучно в БД - нет :) `)
    //console.log()
  try {

    const object_for_1c = {
      id:id, 
      id_change:id_change, 
      id_controler:id_controler,     
      id_machine:id_machine, 
      deviation_percent:deviation_percent, 
      scal:scal, 
      ddate:getDate(),  
      ttime:getTime(), 
      sort:sort, 
      parent_sscc:parent_sscc, 
      child_sscc:child_sscc, 
      quantity_meters_real:quantity_meters_real, 
      quantity_meters_final:quantity_meters_final, 
      cuts:cuts, 
      cutouts_quantity:cutouts_quantity, 
      cutouts_meters:cutouts_meters, 
      defect_code:defect_code, 
      flag_print:flag_print
    }
    console.log(object_for_1c)
    const response = await axios.post(url, object_for_1c, config);
    
    
    if(response.status === 200){
      try {
        const sqlQuery = "INSERT INTO sscc(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
        const result = await db.query(sqlQuery, values);      
        var sort_for_console = "";
        switch (sort) {
          case '1':
            sort_for_console = "Первый сорт"
            break;
          case '2':
            sort_for_console = "Второй сорт"
            break;
          case '3':
            sort_for_console = "Мерный"
            break;
          case '4':
            sort_for_console = "Весовой"
            break;
          case '5':
            sort_for_console = "Переправа"
            break;
          default:
            break;
        }
        console.log(response.status,`Запрос на запись c: ${req.ip.replace('::ffff:','')}`," & Ответ - Кусок успешно принят на сервере 1С, а так же записан в локальную БД. Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
        if(flag == true){
          try {
            const failedQueries = await db.query('SELECT * FROM sscc_v2');
            for (const query of failedQueries.rows) {
              const {id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print} = query;
              const data = {
                id: id,
                id_change: id_change,
                id_controler: id_controler,
                id_machine: id_machine,
                deviation_percent: deviation_percent,
                ddate: ddate,
                ttime: ttime,
                sort: sort,
                parent_sscc: parent_sscc,
                child_sscc: child_sscc,
                quantity_meters_real: quantity_meters_real,
                quantity_meters_final: quantity_meters_final,
                cuts: cuts,
                cutouts_quantity: cutouts_quantity,
                cutouts_meters: cutouts_meters,
                defect_code: defect_code,
                flag_print: flag_print
              };
              const values = [id, id_change, id_controler.toString(), id_machine.toString(), deviation_percent, ddate, ttime, sort, parent_sscc.toString(), child_sscc.toString(), quantity_meters_real, quantity_meters_final, cuts.toString(), cutouts_quantity.toString(), cutouts_meters, defect_code.toString(), flag_print];
              try {
                const response = await axios.post(url, data, config);
                if (response.status === 200) {
                  const sqlQuery = "INSERT INTO sscc (id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
                  await db.query(sqlQuery, values)
                  await db.query('DELETE FROM sscc_v2 WHERE child_sscc = $1', [child_sscc]);
                  console.log(response.status, `Запрос на запись c: ${req.ip.replace('::ffff:','')}`," & Ответ - Кусок успешно принят на сервере 1С, а так же перезаписан в локальную БД(sscc). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
                  flag = false;
                }
                else{
                  const sqlQuery = "INSERT INTO sscc_v2(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
                  const result = await db.query(sqlQuery, values);      
                  var sort_for_console = ''
                  switch (sort) {
                            case '1':
                              sort_for_console = "Первый сорт"
                              break;
                            case '2':
                              sort_for_console = "Второй сорт"
                              break;
                            case '3':
                              sort_for_console = "Мерный"
                              break;
                            case '4':
                              sort_for_console = "Весовой"
                              break;
                            case '5':
                              sort_for_console = "Переправа"
                              break;
                            default:
                              break;
                  }
                  console.log(response.status, `Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ -  Не принят на сервере 1С, но успешно записан в БД (sscc_v2). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
                  flag = true;
                }
              } 
              catch (error) {
                console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,' & Ответ - Не удалось отправить неудачный запрос. Info:', "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final]);
                flag = true;
              }
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          } 
          catch (error) { console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,'Ответ - Не удалось извлечь данные из таблицы sscc_v2 и повторно отправить(ОШИБКА ИЗВЛЕЧЕНИЯ ДАННЫХ)')}
        }
      } 
      catch (error) {
        console.error(error.code);
        if (error.code === '23505') {
          console.log(`Срочно принять меры ~133--`)
          console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`, `Answer - Кусок с таким номером уже есть в БД`)
        }
        else{
          console.log(`Срочно принять меры ~137--`)
          console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ - 0шибка, сервер не смог обрботать запрос")
        }
      } 
      
    } 
    else{
      const sqlQuery = "INSERT INTO sscc_v2(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
      const result = await db.query(sqlQuery, values);      
      var sort_for_console = ''
      switch (sort) {
                case '1':
                  sort_for_console = "Первый сорт"
                  break;
                case '2':
                  sort_for_console = "Второй сорт"
                  break;
                case '3':
                  sort_for_console = "Мерный"
                  break;
                case '4':
                  sort_for_console = "Весовой"
                  break;
                case '5':
                  sort_for_console = "Переправа"
                  break;
                default:
                  break;
      }
      console.log(response.status, `Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ -  Не принят на сервере 1С, но успешно записан в БД (sscc_v2). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
      flag = true;
    }
     
  } 
  catch (error) {
    console.log()
    try {
        const sqlQuery = "INSERT INTO sscc_v2(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
        const result = await db.query(sqlQuery, values);      
        var sort_for_console = ''
        switch (sort) {
          case '1':
            sort_for_console = "Первый сорт"
            break;
          case '2':
            sort_for_console = "Второй сорт"
            break;
          case '3':
            sort_for_console = "Мерный"
            break;
          case '4':
            sort_for_console = "Весовой"
            break;
          case '5':
            sort_for_console = "Переправа"
            break;
          default:
            break;
        }
        console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ -  Не принят на сервере 1С, но успешно записан в БД (sscc_v2). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
        console.log(error.config.url+'  ->  '+error.config.data);
        console.log(error.response.status+'  ->  '+error.response.data)
        flag = true;
      } 
      catch (error) {
        if (error.code === '23505') { 
          console.log(`--178-- Запрос на запись c: ${req.ip.replace('::ffff:','')}`, `Answer - Кусок с таким номером уже есть в БД`)
        }
        else{
          console.log(`--182-- Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ - 0шибка, сервер не смог обрботать запрос")
        }
    }
  }
  }
  } 
  catch (error) {
    
    console.log("0 - Сообщение не расшифрованно, ..."); //todo
    res.status(200).send({"status":"0"});
  }
  console.log()  
}

async createPost_flap_m(req, res) {
  const ddate = getDate()
  const ttime = getTime()
  const cuts = "0"
  const cutouts_quantity = "0"
  const cutouts_meters = "0.0"
  var result2 = '';
  try {
    result2 = req.body;    
    for (let i = 0; i < result2.length; i++) {
      let charCode = BigInt(result2.charCodeAt(i));
      let xorResult = charCode ^ BigInt(key_m);
      let xorString = xorResult.toString();
      result2 = result2.slice(0, i) + String.fromCharCode(Number(xorString)) + result2.slice(i + 1);
    }   
  //console.log("Сообщение расшифрованно");
  //console.log()
  const result3 = JSON.parse(result2)  
  const {id, id_change, id_controler, id_machine, deviation_percent, scal, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, defect_code, flag_print} = result3;
  const values = [id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final,cuts,cutouts_quantity, cutouts_meters, defect_code, flag_print];
  const scalSQL = await db.query("INSERT INTO scalling_factor(id_controler, id_machine, ddate, ttime, scal) values ($1,$2,$3,$4,$5) returning*",[id_controler, id_machine, ddate, ttime, scal])
  const sqlQuerySearchChild = await db.query("SELECT * FROM sscc WHERE child_sscc = $1 LIMIT 1", [child_sscc]);
  const sqlQuerySearchChild_v2 = await db.query("SELECT * FROM sscc_v2 WHERE child_sscc = $1 LIMIT 1", [child_sscc]);
  if(sqlQuerySearchChild.rows.length > 0 || sqlQuerySearchChild_v2.rows.length > 0){
    res.status(200).send({"status" : "o"})
    console.log(`Запрос c: ${req.ip.replace('::ffff:','')} на поиск КУСКА: `, parseInt([child_sscc]), ` & Ответ: "o" - Такой кусок к сожалению уже есть в БД, рекомендуется использовать другой номер куска :)`) 
    //console.log()
  }
  else {
    res.status(200).send({"status" : "i"})  
    console.log(`Запрос c: ${req.ip.replace('::ffff:','')} на поиск КУСКА:`, parseInt([child_sscc]), ` & Ответ: "i" - Куска с таким номером благополучно в БД - нет :) `)
    //console.log()
  try {
    const object_for_1c = {
      id:id, 
      id_change:id_change, 
      id_controler:id_controler,     
      id_machine:id_machine, 
      deviation_percent:deviation_percent, 
      scal:scal, 
      ddate:getDate(),  
      ttime:getTime(), 
      sort:sort, 
      parent_sscc:parent_sscc, 
      child_sscc:child_sscc, 
      quantity_meters_real:quantity_meters_real, 
      quantity_meters_final:quantity_meters_final, 
      cuts:cuts, 
      cutouts_quantity:cutouts_quantity, 
      cutouts_meters:cutouts_meters, 
      defect_code:defect_code, 
      flag_print:flag_print
    }
    console.log(object_for_1c)
    const response = await axios.post(url, object_for_1c, config);
    
    if(response.status === 200){
      try {
        const sqlQuery = "INSERT INTO sscc(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
        const result = await db.query(sqlQuery, values);       
        var sort_for_console = "";
        switch (sort) {
          case '1':
            sort_for_console = "Первый сорт"
            break;
          case '2':
            sort_for_console = "Второй сорт"
            break;
          case '3':
            sort_for_console = "Мерный"
            break;
          case '4':
            sort_for_console = "Весовой"
            break;
          case '5':
            sort_for_console = "Переправа"
            break;
          default:
            break;
        }
        console.log(response.status,`Запрос на запись c: ${req.ip.replace('::ffff:','')}`," & Ответ - Кусок успешно принят на сервере 1С, а так же записан в локальную БД. Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
        if(flag == true){
          try {
            const failedQueries = await db.query('SELECT * FROM sscc_v2');
            for (const query of failedQueries.rows) {
              const {id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, defect_code, flag_print} = query;
              const data = {
                id: id,
                id_change: id_change,
                id_controler: id_controler,
                id_machine: id_machine,
                deviation_percent: deviation_percent,
                ddate: ddate,
                ttime: ttime,
                sort: sort,
                parent_sscc: parent_sscc,
                child_sscc: child_sscc,
                quantity_meters_real: quantity_meters_real,
                quantity_meters_final: quantity_meters_final,
                defect_code: defect_code,
                flag_print: flag_print
            };
            const values = [id, id_change, id_controler.toString(), id_machine.toString(), deviation_percent, ddate, ttime, sort, parent_sscc.toString(), child_sscc.toString(), quantity_meters_real, quantity_meters_final, defect_code.toString(), flag_print];
              try {
                const response = await axios.post(url, data, config);
                if (response.status === 200) {
                  const sqlQuery = "INSERT INTO sscc(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
                  const result = await db.query(sqlQuery, values);   
                  await db.query('DELETE FROM sscc_v2 WHERE child_sscc = $1', [child_sscc]);
                  console.log(response.status, `Запрос на запись c: ${req.ip.replace('::ffff:','')}`," & Ответ - Кусок успешно принят на сервере 1С, а так же перезаписан в локальную БД(sscc_flap). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
                  flag = false;
                }
                
              } 
              catch (error) {
                console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,' & Ответ - Не удалось отправить неудачный запрос. Info:', "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final]);
                flag = true;
              }
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          } 
          catch (error) { console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,'Ответ - Не удалось извлечь данные из таблицы sscc_v2 и повторно отправить(ОШИБКА ИЗВЛЕЧЕНИЯ ДАННЫХ)')}
        }
        
      } 
      catch (error) {
        console.error(error);
        if (error.code === '23505') {
          console.log(`Срочно принять меры ~133--`)
          console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`, `Answer - Кусок с таким номером уже есть в БД`)
        }
        else{
          console.log(`Срочно принять меры ~137--`)
          console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ - 0шибка, сервер не смог обрботать запрос")
        }
      } 
      
    }   
    else{
      const sqlQuery = "INSERT INTO sscc_v2(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
      const result = await db.query(sqlQuery, values);   
     
      //const sqlQuery = "INSERT INTO sscc_v2(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *";
      //const result = await db.query(sqlQuery, values);
      var sort_for_console = "";
        switch (sort) {
          case '1':
            sort_for_console = "Первый сорт"
            break;
          case '2':
            sort_for_console = "Второй сорт"
            break;
          case '3':
            sort_for_console = "Мерный"
            break;
          case '4':
            sort_for_console = "Весовой"
            break;
          case '5':
            sort_for_console = "Переправа"
            break;
          default:
            break;
        }
        console.log(response.status,`Запрос на запись c: ${req.ip.replace('::ffff:','')}`," & Ответ - Кусок успешно принят на сервере 1С, а так же записан в локальную БД. Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
        flag = true;
    } 
  } 
  catch (error) {
    try {
      const sqlQuery = "INSERT INTO sscc_v2(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
      const result = await db.query(sqlQuery, values);  
        var sort_for_console = ''
        switch (sort) {
          case '1':
            sort_for_console = "Первый сорт"
            break;
          case '2':
            sort_for_console = "Второй сорт"
            break;
          case '3':
            sort_for_console = "Мерный"
            break;
          case '4':
            sort_for_console = "Весовой"
            break;
          case '5':
            sort_for_console = "Переправа"
            break;
          default:
            break;
        }
        console.log(`Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ -  Не принят на сервере 1С, но успешно записан в БД (sscc_flap_v2). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
        flag = true;
      } 
      catch (error) {
        if (error.code === '23505') { 
          console.log(`--178-- Запрос на запись c: ${req.ip.replace('::ffff:','')}`, `Answer - Кусок с таким номером уже есть в БД(sscc_flap_v2)`)
        }
        else{
          console.log(error)
          console.log(`--325-- Запрос на запись c: ${req.ip.replace('::ffff:','')}`,"& Ответ - 0шибка, сервер не смог обрботать запрос")
        }
    }
  }
  }
  } 
  catch (error) {
    console.error(error);
    console.log("0 - Сообщение не расшифрованно, ..."); //todo
    res.json({ "status" : "0" });
  }
  console.log()
}

async createPost_trim(req, res){
  var result2 = '';
  try {
    result2 = req.body;    
    for (let i = 0; i < result2.length; i++) {
      let charCode = BigInt(result2.charCodeAt(i));
      let xorResult = charCode ^ BigInt(key_m);
      let xorString = xorResult.toString();
      result2 = result2.slice(0, i) + String.fromCharCode(Number(xorString)) + result2.slice(i + 1);
    }   
    console.log("Сообщение расшифрованно");
    console.log()

    const obj = JSON.parse(result2)
    const { parent_sscc, sort, quantity_meters_real, quantity_meters_final } = obj
    console.log(obj)
    res.status(200).send({"status":"k"})
    try {
      const response = await axios.post(url, obj, config);
      if(response.status == 200){
        //res.status(200).send({"status":"k"})
        const sql = await db.query("INSERT INTO trim (parent_sscc, sort, q_trim, m_trim) VALUES ($1,$2,$3,$4) RETURNING*",[parent_sscc, sort, quantity_meters_real, quantity_meters_final])
        console.log(response.data)
        
      }
      else if(response.status == 500) {
        //res.status(200).send({"status":"k"})
        const sql = await db.query("INSERT INTO trim_v2 (parent_sscc, sort, q_trim, m_trim) VALUES ($1,$2,$3,$4) RETURNING*",[parent_sscc, sort, quantity_meters_real, quantity_meters_final])
        console.log(response.data)
      }
      else {
        
        const sql = await db.query("INSERT INTO trim_v2 (parent_sscc, sort, q_trim, m_trim) VALUES ($1,$2,$3,$4) RETURNING*",[parent_sscc, sort, quantity_meters_real, quantity_meters_final])
        console.log(response.data)
      }
    } catch (error) {
      console.log(error)
      res.status(200).send({"status":"l"})
    }

  } catch (error) {
    res.status(200).send({"status":"k"})
    console.log(error)
  }
}
async test(req, res){
  //...
}

}

function getDate(){
  let now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yyyy = now.getFullYear()

  const date = yyyy + '-' + mm + '-' + dd
  return date
}
function getTime(){

  const now = new Date();
  const hh = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  const mmm = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  const ss = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
  const ttime = hh + ':' + mmm + ':' + ss;

  return ttime
}
module.exports = new PostController()