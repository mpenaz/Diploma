class CreatePlans < ActiveRecord::Migration[5.0]
  def change
    create_table :plans do |t|
      t.belongs_to :user, index: true
      t.belongs_to :evaluation, index:true
      t.date :start
      t.date :end
      t.string :status

      t.timestamps
    end
  end
end
