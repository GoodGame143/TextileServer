const db = require('../dbsll')
const axios = require('axios')


class DBController {
    async getInfoByDate(req, res){
        const object = req.params.search_date;
        const ddate = object
        let arrayList = []
        if(object.length === 10){
          const sqlRequest = await db.query(`select * from sscc where ddate='${[ddate]}'`)
          for(const query of sqlRequest.rows){
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
            arrayList.push(data)   
          }
        }
        else {
          const sqlRequest = await db.query(`select * from sscc where ddate like '%${[ddate]}%'`)
          for(const query of sqlRequest.rows){
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
            arrayList.push(data)   
          }
        }
        res.send(arrayList)
        // if(sqlRequest.rows[0] != null){
        // }
      }
      async getInfoByTime(req, res) {
        const object = req.params.search_time
        const ttime = object
        let arrayList = []
        if(object.length === 10){
          const sqlRequest = await db.query(`select * from sscc where ttime=${ttime} `)
          for(const query of sqlRequest.rows){
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
            arrayList.push(data)
          }       
        }
        else {
          const sqlRequest = await db.query(`select * from sscc where ttime like '%${ttime}%' `)
          for(const query of sqlRequest.rows){
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
            arrayList.push(data)
          }
        }
        res.send(arrayList)
      }
      async all_SQL_request(req, res){
        try {
          const body = JSON.stringify(req.body)
          const { request } = JSON.parse(body)
          console.log(request)
          const sql = await db.query(request)
          if(sql.command === 'SELECT'){
            console.log(sql.rows)
            res.status(200).send(sql.rows)
          }
          else if(sql.command === 'INSERT'){
            res.status(200).send({"rows" : "add"})
          }
          else {
            console.log(sql)
            res.status(200).send({"rows" : "NULL"})
          }
          
        //res.status(200).send({"status" : sqlReq.rows})
        } catch (error) {
          res.status(200).send({"err" : `${error}`})
        }
        
      }





}
module.exports = new DBController()