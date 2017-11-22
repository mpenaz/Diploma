# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171121164602) do

  create_table "evaluations", force: :cascade do |t|
    t.string "description"
    t.string "rating"
  end

  create_table "goals", force: :cascade do |t|
    t.integer "plan_id"
    t.integer "user_id"
    t.integer "goal_id"
    t.string  "title"
    t.string  "description"
    t.string  "complexity"
    t.string  "priority"
    t.integer "progress"
    t.index ["goal_id"], name: "index_goals_on_goal_id"
    t.index ["plan_id"], name: "index_goals_on_plan_id"
    t.index ["user_id"], name: "index_goals_on_user_id"
  end

  create_table "goals_plans", id: false, force: :cascade do |t|
    t.integer "goal_id", null: false
    t.integer "plan_id", null: false
  end

  create_table "plans", force: :cascade do |t|
    t.integer "user_id"
    t.integer "evaluation_id"
    t.date    "startDate"
    t.date    "endDate"
    t.string  "status"
    t.index ["evaluation_id"], name: "index_plans_on_evaluation_id"
    t.index ["user_id"], name: "index_plans_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.integer "manager_id"
    t.string  "name"
    t.string  "email"
    t.index ["manager_id"], name: "index_users_on_manager_id"
  end

end
