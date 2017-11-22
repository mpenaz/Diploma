class CreateGoals < ActiveRecord::Migration[5.0]
  def change
    create_table :goals do |t|
      t.belongs_to :plan, index: true
      t.belongs_to :user, index: true
      t.belongs_to :goal, index: true
      t.string :title
      t.string :description
      t.string :complexity
      t.string :priority
      t.integer :progress

      t.timestamps
    end
  end
end
