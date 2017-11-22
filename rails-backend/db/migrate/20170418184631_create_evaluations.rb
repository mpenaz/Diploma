class CreateEvaluations < ActiveRecord::Migration[5.0]
  def change
    create_table :evaluations do |t|
      t.string :description
      t.string :rating

      t.timestamps
    end
  end
end
