const format = require('date-fns/format')
const express = require('express')
const path = require('path')
const isValid = require('date-fns/isValid')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const parseISO = require('date-fns/parseISO')
const app = express()
app.use(express.json())

const dbPath = path.join(__dirname, 'todoApplication.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

const checkStatusFunction = status => {
  if (status === 'TO DO' || status === 'IN PROGRESS' || status === 'DONE') {
    return true
  } else {
    return false
  }
}

const checkPriorityFunction = priority => {
  if (priority === 'HIGH' || priority === 'MEDIUM' || priority === 'LOW') {
    return true
  } else {
    return false
  }
}

const checkCatagoryFunction = catagory => {
  if (catagory === 'WORK' || catagory === 'HOME' || catagory === 'LEARNING') {
    return true
  } else {
    return false
  }
}

const checkDateFUnction = date => {
  return format(new Date(date), 'yyyy-MM-dd')
}

// API 1

app.get('/todos/', async (request, response) => {
  const queryParameters = request.query
  const {status, priority, search_q, category} = queryParameters
  if (
    status !== undefined &&
    priority === undefined &&
    search_q === undefined &&
    category === undefined
  ) {
    const statusCheck = checkStatusFunction(status)
    if (statusCheck === true) {
      const getTodowithStatusQuery = `
      SELECT * FROM 
      todo
      WHERE
      status = '${status}'
      ORDER BY
      id
      `
      const statusTodoArray = await db.all(getTodowithStatusQuery)
      response.send(
        statusTodoArray.map(each => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each['due_date'],
          }
        }),
      )
    } else {
      response.status(400)
      response.send('Invalid Todo Status')
    }
  } else if (
    status === undefined &&
    priority !== undefined &&
    search_q === undefined &&
    category === undefined
  ) {
    const priorityCheck = checkPriorityFunction(priority)
    if (priorityCheck === true) {
      const getTodowithPriorityQuery = `
      SELECT * FROM 
      todo
      WHERE
      priority = '${priority}'
      ORDER BY
      id
      `
      const priorityTodoArray = await db.all(getTodowithPriorityQuery)
      response.send(
        priorityTodoArray.map(each => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each['due_date'],
          }
        }),
      )
    } else {
      response.status(400)
      response.send('Invalid Todo Priority')
    }
  } else if (
    status !== undefined &&
    priority !== undefined &&
    search_q === undefined &&
    category === undefined
  ) {
    const statusCheck = checkStatusFunction(status)
    const priorityCheck = checkPriorityFunction(priority)

    if (statusCheck === true && priorityCheck === true) {
      const getStatusAndPriorityQuery = `
      SELECT *
      FROM 
      todo
      WHERE
      priority = '${priority}'
      AND
      status = '${status}'
      ORDER BY
      id`

      const statusAndPriorityArray = await db.all(getStatusAndPriorityQuery)
      response.send(
        statusAndPriorityArray.map(each => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each['due_date'],
          }
        }),
      )
    } else if (statusCheck === false) {
      response.status(400)
      response.send('Invalid Todo Status')
    } else if (priorityCheck === false) {
      response.status(400)
      response.send('Invalid Todo Priority')
    }
  } else if (
    status === undefined &&
    priority === undefined &&
    search_q !== undefined &&
    category === undefined
  ) {
    const getsearchTodoQuery = `
      SELECT * FROM
      todo
      WHERE 
      todo LIKE '%${search_q}%'
      ORDER BY 
      id`

    const searchTodoArray = await db.all(getsearchTodoQuery)
    response.send(
      searchTodoArray.map(each => {
        return {
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each['due_date'],
        }
      }),
    )
  } else if (
    status !== undefined &&
    priority === undefined &&
    search_q === undefined &&
    category !== undefined
  ) {
    const statusCheck = checkStatusFunction(status)
    const checkCatagory = checkCatagoryFunction(category)
    if (statusCheck === true && checkCatagory === true) {
      const getStatusAndCategoryQuery = `
      SELECT *
      FROM 
      todo
      WHERE
      category = '${category}'
      AND
      status = '${status}'
      ORDER BY
      id`

      const statusAndCategoryArray = await db.all(getStatusAndCategoryQuery)
      response.send(
        statusAndCategoryArray.map(each => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each['due_date'],
          }
        }),
      )
    } else if (statusCheck === false) {
      response.status(400)
      response.send('Invalid Todo Status')
    } else if (checkCatagory === false) {
      response.status(400)
      response.send('Invalid Todo Category')
    }
  } else if (
    status === undefined &&
    priority === undefined &&
    search_q === undefined &&
    category !== undefined
  ) {
    const checkCatagory = checkCatagoryFunction(category)
    if (checkCatagory === true) {
      const getcategoryTodoQuery = `
      SELECT * FROM
      todo
      WHERE 
      category = '${category}'
      ORDER BY 
      id`

      const categoryTodoArray = await db.all(getcategoryTodoQuery)
      response.send(
        categoryTodoArray.map(each => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each['due_date'],
          }
        }),
      )
    } else {
      response.status(400)
      response.send('Invalid Todo Category')
    }
  } else if (
    status === undefined &&
    priority !== undefined &&
    search_q === undefined &&
    category !== undefined
  ) {
    const checkCatagory = checkCatagoryFunction(category)
    const priorityCheck = checkPriorityFunction(priority)
    if (checkCatagory === true && priorityCheck === true) {
      const getCategoryandPriorityQuery = `
      SELECT *
      FROM 
      todo
      WHERE
      category = '${category}'
      AND
      priority = '${priority}'
      ORDER BY
      id`

      const categoryandPriorityArray = await db.all(getCategoryandPriorityQuery)
      response.send(
        categoryandPriorityArray.map(each => {
          return {
            id: each.id,
            todo: each.todo,
            priority: each.priority,
            status: each.status,
            category: each.category,
            dueDate: each['due_date'],
          }
        }),
      )
    } else if (checkCatagory === false) {
      response.status(400)
      response.send('Invalid Todo Category')
    } else if (priorityCheck === false) {
      response.status(400)
      response.send('Invalid Todo Priority')
    }
  }
})

// API 2

app.get('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const getTodoByidOuwery = `
  SELECT * FROM
  todo 
  WHERE
  id = ${todoId} `
  const each = await db.get(getTodoByidOuwery)
  response.send({
    id: each.id,
    todo: each.todo,
    priority: each.priority,
    status: each.status,
    category: each.category,
    dueDate: each['due_date'],
  })
})

// API 3

app.get('/agenda/', async (request, response) => {
  const {date} = request.query
  const pdate = new Date(date)
  const checkd = isValid(pdate)
  console.log(checkd)
  if (checkd === false) {
    response.status(400)
    response.send('Invalid Due Date')
  } else {
    const cDate = format(new Date(pdate), 'yyyy-MM-dd')
    const getTodobyAgendaQuery = `
                SELECT * FROM 
                todo
                WHERE
                due_date = '${cDate}'
                ORDER BY 
                id
                
                `
    const getTodobyAgendaArray = await db.all(getTodobyAgendaQuery)
    response.send(
      getTodobyAgendaArray.map(each => {
        return {
          id: each.id,
          todo: each.todo,
          priority: each.priority,
          status: each.status,
          category: each.category,
          dueDate: each['due_date'],
        }
      }),
    )
  }
})

// API 4

app.post('/todos/', async (request, response) => {
  const newtodo = request.body
  const {id, todo, priority, status, category, dueDate} = newtodo
  const statusCheck = checkStatusFunction(status)
  const priorityCheck = checkPriorityFunction(priority)
  const catagoryCheck = checkCatagoryFunction(category)
  const pdate = new Date(dueDate)
  const checkd = isValid(pdate)

  if (
    statusCheck === true &&
    priorityCheck === true &&
    catagoryCheck === true &&
    checkd === true
  ) {
    const checkDate = checkDateFUnction(dueDate)
    const addtodoQuery = `
    INSERT INTO todo
    (id, todo, priority, status, category, due_date)
    VALUES (
      ${id},
      '${todo}',
      '${priority}',
      '${status}',
      '${category}',
      '${checkDate}'
    )`
    await db.run(addtodoQuery)
    response.send('Todo Successfully Added')
  } else if (statusCheck !== true) {
    response.status(400)
    response.send('Invalid Todo Status')
  } else if (priorityCheck !== true) {
    response.status(400)
    response.send('Invalid Todo Priority')
  } else if (catagoryCheck !== true) {
    response.status(400)
    response.send('Invalid Todo Category')
  } else if (checkd === false) {
    response.status(400)
    response.send('Invalid Due Date')
  }
})

// API 5
app.put('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const updateTodo = request.body
  const {id, todo, priority, status, category, dueDate} = updateTodo
  const statusCheck = checkStatusFunction(status)
  const priorityCheck = checkPriorityFunction(priority)
  const catagoryCheck = checkCatagoryFunction(category)

  if (
    status !== undefined &&
    priority === undefined &&
    todo === undefined &&
    category === undefined &&
    dueDate === undefined
  ) {
    if (statusCheck === true) {
      const updateTodowithStatusQuery = `
      UPDATE 
      todo 
      SET 
      status='${status}'
      WHERE
      id = ${todoId}
      `
      await db.run(updateTodowithStatusQuery)
      response.send('Status Updated')
    } else {
      response.status(400)
      response.send('Invalid Todo Status')
    }
  } else if (
    status === undefined &&
    priority !== undefined &&
    todo === undefined &&
    category === undefined &&
    dueDate === undefined
  ) {
    if (priorityCheck === true) {
      const updateTodowithPriorityQuery = `
      UPDATE 
      todo 
      SET 
      priority='${priority}'
      WHERE
      id = ${todoId}
      `
      await db.run(updateTodowithPriorityQuery)
      response.send('Priority Updated')
    } else {
      response.status(400)
      response.send('Invalid Todo Priority')
    }
  } else if (
    status === undefined &&
    priority === undefined &&
    todo !== undefined &&
    category === undefined &&
    dueDate === undefined
  ) {
    const updateTodoQuery = `
      UPDATE 
      todo 
      SET 
      todo='${todo}'
      WHERE
      id = ${todoId}
      `
    await db.run(updateTodoQuery)
    response.send('Todo Updated')
  } else if (
    status === undefined &&
    priority === undefined &&
    todo === undefined &&
    category !== undefined &&
    dueDate === undefined
  ) {
    if (catagoryCheck === true) {
      const updateTodowithCategoryQuery = `
      UPDATE 
      todo 
      SET 
      category='${category}'
      WHERE
      id = ${todoId}
      `
      await db.run(updateTodowithCategoryQuery)
      response.send('Category Updated')
    } else {
      response.status(400)
      response.send('Invalid Todo Category')
    }
  } else if (
    status === undefined &&
    priority === undefined &&
    todo === undefined &&
    category === undefined &&
    dueDate !== undefined
  ) {
    const pdate = new Date(dueDate)
    const checkd = isValid(pdate)

    if (checkd === false) {
      response.status(400)
      response.send('Invalid Due Date')
    } else {
      const checkDate = checkDateFUnction(dueDate)
      const updateTodowithdateQuery = `
      UPDATE 
      todo 
      SET 
      due_date='${checkDate}'
      WHERE
      id = ${todoId}
      `
      await db.run(updateTodowithdateQuery)
      response.send('Due Date Updated')
    }
  }
})

app.delete('/todos/:todoId/', async (request, response) => {
  const {todoId} = request.params
  const deleteTOdoquery = `
   DELETE
   FROM
   todo
   WHERE
   id = ${todoId}`
  await db.run(deleteTOdoquery)
  response.send('Todo Deleted')
})

module.exports = app
