const db = require('../dbsll')

class UserController{
      async searchr(req, res) {
        const { parent_sscc } = req.body;
        try { 
          const sqlQuery = await db.query("SELECT * FROM sscc_roll WHERE roll = $1 LIMIT 1", [parent_sscc]);
          if (sqlQuery.rows.length > 0) {
            res.status(200).send({ "status": "y" });
            console.log(`Запрос c : ${req.ip.replace('::ffff:','')} на поиск РОЛИКА:`, parseInt([parent_sscc]), `& Ответ: "y" - Ролик благополучно найден в БД :)`) 
          } else {
            res.status(200).send({ "status": "n" });
            console.log(`Запрос c : ${req.ip.replace('::ffff:','')} на поиск РОЛИКА:`, parseInt([parent_sscc]), ` & Ответ: "n" - Ролик не найден, примите пожалуйста ролик на склад :)`)
          }
        } catch (error) {
          console.error(error);
          res.status(200).send({ "status": "e" });
          console.log(`Запрос c : ${req.ip.replace('::ffff:','')} на поиск РОЛИКА:`, parseInt([parent_sscc]), ` & Ответ: "e" - Ошибка, сервер не смог выполнить поиск ролика в БД :( Обратитесь пожалуйста к системному администратору`)
        }
        console.log()
      }
}
module.exports = new UserController()