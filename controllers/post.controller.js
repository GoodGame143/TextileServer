const { response } = require('express')
const db = require('../dbsll')
const axios = require('axios')
const fs = require('fs')
const min = 3
const max = 8
//var key = 0n
const p = 100
const g = 4
const key_m = 37n
var flag = false
var flagFlap = false
const username = "ObmenSSCC";
const password = "join";
let url = 'http://192.168.21.6/erp25/hs/ssccAPI/child'

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
  res.status(200).send("OK")
  resending()
  resendingTrim()
  
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
  var decryptData = decrypt(req.body)
  const json = JSON.parse(decryptData)  
  writeFile(json)
 
  const {id, id_change, id_controler, id_machine, deviation_percent, scal, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print} = json;
  const values = [id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print];
  try{
    const scalling = await db.query("INSERT INTO scalling_factor(id_controler, id_machine, ddate, ttime, scal) VALUES ($1, $2, $3, $4, $5) RETURNING*",[id_controler, id_machine, ddate, ttime, scal])
  }
  catch(err){
    console.log(err)
  }
  
  
  const sqlQuerySearchChild = await search(child_sscc)

  if(sqlQuerySearchChild === "q"){
    res.status(200).send({"status" : "q"})
  }
  else {
    res.status(200).send({"status" : "1"})  
  
  try {

    const response = await sendInfo1C(id, id_change, id_controler, id_machine, deviation_percent, scal, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print)

    if(response === 200){
      await recordSSCC(1, values)
        if(flag == true){
          resending()
        }
    } 
    else{
      await recordSSCC(2, values)
      flag = true
    }
     
  } 
  catch (error) {
    
    await recordSSCC(2, values)
    if(error.config){
      console.log(error.config.url+'  ->  '+error.config.data);
    }
    if(error.response){
      console.log(error.response.status+'  ->  '+error.response.data)
    }
    flag = true
    
  }
  }
  
  console.log()  
}

async createPost_flap_m(req, res) {
  const ddate = getDate()
  const ttime = getTime()
  const cuts = "0"
  const cutouts_quantity = "0"
  const cutouts_meters = "0.0"

  const decryptData = decrypt(req.body)
  const json = JSON.parse(decryptData)  
  writeFile(json)
 
  const {id, id_change, id_controler, id_machine, deviation_percent, scal, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, defect_code, flag_print} = json;
  const values = [id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final,cuts,cutouts_quantity, cutouts_meters, defect_code, flag_print];
  
  const scalSQL = await db.query("INSERT INTO scalling_factor(id_controler, id_machine, ddate, ttime, scal) values ($1,$2,$3,$4,$5) returning*",[id_controler, id_machine, ddate, ttime, scal])
  
  const sqlQuerySearchChild = await search(child_sscc)

  if(sqlQuerySearchChild === "q"){
    res.status(200).send({"status" : "o"})
  }
  else {
    res.status(200).send({"status" : "i"})  

  try {
    const response = await sendInfo1C(id, id_change, id_controler, id_machine, deviation_percent, scal, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print)

    if(response === 200){
      await recordSSCC(1, values)
        if(flag == true){
          resending()
        }
    } 
    else{
      await recordSSCC(2, values)
      flag = true
    }
  } 
  catch (error) {
    await recordSSCC(2, values)
    if(error.config){
      console.log(error.config.url+'  ->  '+error.config.data);
    }
    if(error.response){
      console.log(error.response.status+'  ->  '+error.response.data)
    }
    flag = true
        
  } 
      
}   
}

async createPost_trim(req, res){

  var decryptData = decrypt(req.body)
  const json = JSON.parse(decryptData)  
  writeFile(json)

    const { parent_sscc, sort, quantity_meters_real, quantity_meters_final } = json
    const values =  [parent_sscc, sort, quantity_meters_real, quantity_meters_final ]

    writeFile(json)

    res.status(200).send({"status":"k"})
    try {
      const response = await axios.post(url, json, config);

      if(response.status == 200){
        recordTrim(1, values)
        console.log(response.status, response.data)
      }
      else if(response.status == 500) {
        recordTrim(2, values)
      }
      else {
        recordTrim(2, values)
      }

      if(flagFlap == true){
        resendingTrim()
      }

    } catch (error) {
      if(error.config){
        console.log(error.config.url+'  ->  '+error.config.data);
      }
      if(error.response){
        console.log(error.response.status+'  ->  '+error.response.data)
      }
    }
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
async function recordSSCC(version, values){
  
    if(version == 1){
      const sqlQuery = "INSERT INTO sscc(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
      const result = await db.query(sqlQuery, values);      
      
     }
    else if(version == 2) {
      const sqlQuery = "INSERT INTO sscc_v2(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
      const result = await db.query(sqlQuery, values);      
      
    }
    else {
      const sqlQuery = "INSERT INTO sscc_v3(id, id_change, id_controler, id_machine, deviation_percent, ddate, ttime, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *";
      const result = await db.query(sqlQuery, values);      
      
    }
 
 
}
async function recordTrim(version, values){
 
  if(version == 1){
    const sql = await db.query("INSERT INTO trim (parent_sscc, sort, q_trim, m_trim) VALUES ($1,$2,$3,$4) RETURNING*",values)      
  }
  else if(version == 2) {
    const sql = await db.query("INSERT INTO trim_v2 (parent_sscc, sort, q_trim, m_trim) VALUES ($1,$2,$3,$4) RETURNING*",values)
    
  }
  else {
    const sql = await db.query("INSERT INTO trim_v2 (parent_sscc, sort, q_trim, m_trim) VALUES ($1,$2,$3,$4) RETURNING*",values)
  }
}
function decrypt(data){
  var result2 = data
  try {    
    for (let i = 0; i < result2.length; i++) {
      let charCode = BigInt(result2.charCodeAt(i));
      let xorResult = charCode ^ BigInt(key_m);
      let xorString = xorResult.toString();
      result2 = result2.slice(0, i) + String.fromCharCode(Number(xorString)) + result2.slice(i + 1);
    } 
    console.log(result2)
  } 
  catch (error) {
    
    console.log("0 - Сообщение не расшифрованно, ..."); //todo
    
    result2 = "0"

    //res.status(200).send({"status":"0"});
  }
  return result2
}
async function search(child_sscc){
  let answer = ""
  const sqlQuerySearchChild = await db.query("SELECT * FROM sscc WHERE child_sscc = $1 LIMIT 1", [child_sscc]);
  const sqlQuerySearchChild_v2 = await db.query("SELECT * FROM sscc_v2 WHERE child_sscc = $1 LIMIT 1", [child_sscc]);

  if(sqlQuerySearchChild.rows.length > 0){
    answer = "q"
    //console.log(`Запрос c: ${req.ip.replace('::ffff:','')} на поиск КУСКА: `, parseInt([child_sscc]), ` & Ответ: "q" - Такой кусок к сожалению уже есть в БД, рекомендуется использовать другой номер куска :)`) 

  }
  else if(sqlQuerySearchChild_v2.rows.length > 0){
    answer = "q"
  }
  else {
    answer = "1"
    //console.log(`Запрос c: ${req.ip.replace('::ffff:','')} на поиск КУСКА:`, parseInt([child_sscc]), ` & Ответ: "w" - Куска с таким номером благополучно в БД - нет :) `)
 
  }
  return answer
}
async function sendInfo1C(id, id_change, id_controler, id_machine, deviation_percent, scal, sort, parent_sscc, child_sscc, quantity_meters_real, quantity_meters_final, cuts, cutouts_quantity, cutouts_meters, defect_code, flag_print){
  
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
  
  const response = await axios.post(url, object_for_1c, config);
  
  const a = response.data
  console.log(response.status, [a[0], a[1], a[4], a[5]])

  return response.status
}
async function resending(){
   
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
      
      const response = await axios.post(url, data, config);

      const sort_for_console = sort1(sort)

      if (response.status === 200 ) { //&& response.data[1] === child_sscc

        recordSSCC(1, values)
        await db.query('DELETE FROM sscc_v2 WHERE child_sscc = $1', [child_sscc]);
        const a = response.data
        console.log(response.status, [a[1],a[4],a[5]]," Перезаписан в локальную БД(sscc). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
        flag = false;
      }
      else{
        const a = response.data
        console.log(response.status, [a[1],a[4],a[5]], "Не перезаписан в локальную БД(sscc) Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])

        flag = true;
      }
      recordSSCC(3, values)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  } 
  catch (error) { 

    
    if(error.config){
      console.log(error.config.url+'  ->  '+error.config.data);
    }
    if(error.response){
      console.log(error.response.status+'  ->  '+error.response.data)
    }
    flag = true
  }
}
async function resendingTrim(){
   
  try {
    const failedQueries = await db.query('SELECT * FROM trim_v2');
    for (const query of failedQueries.rows) {
      const {parent_sscc, sort, quantity_meters_real, quantity_meters_final} = query;
      const data = {
        sort: sort,
        parent_sscc: parent_sscc.toString(),
        quantity_meters_real: quantity_meters_real.toString(),
        quantity_meters_final: quantity_meters_final.toString(),
      };
      const values = [parent_sscc, sort, quantity_meters_real, quantity_meters_final]

      const response = await axios.post(url, data, config);

      const sort_for_console = sort1(sort)

      if (response.status === 200 ) { //&& response.data[1] === child_sscc

        await recordTrim(1, values)
        await db.query('DELETE FROM sscc_v2 WHERE child_sscc = $1', [child_sscc]);
        const a = response.data
        console.log(response.status, [a[1],a[4],a[5]]," Перезаписан в локальную БД(sscc). Info:", "Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])
        flag = false;
      }
      else{
        await recordTrim(2, values)
        const a = response.data
        console.log(response.status, [a[1],a[4],a[5]], "Не перезаписан в локальную БД(sscc) Дата -",[ddate], "Время -",[ttime], "Ролик:",[parent_sscc], "Кусок:",[child_sscc], [sort_for_console], "Метры:",[quantity_meters_final])

        flag = true;
      }
      
      
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  } 
  catch (error) { 

    
    if(error.config){
      console.log(error.config.url+'  ->  '+error.config.data);
    }
    if(error.response){
      console.log(error.response.status+'  ->  '+error.response.data)
    }
    flag = true
  }
}
function sort1(sort){
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
    return sort_for_console
}
function writeFile(data){
  const buf = JSON.stringify(data, null, 2)
  fs.appendFile('E:\\children.txt', ','+'\n'+buf, (err) => {
    //console.log(data)
    if(err){
      console.log(err, data)
    }
  })
}
module.exports = new PostController()
