class CreatePlanUsers < ActiveRecord::Migration[5.0]
  def change
    create_join_table :goals, :plans
  end
end
