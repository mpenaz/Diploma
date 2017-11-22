class RemoveTimestamps < ActiveRecord::Migration[5.0]
  def change
    remove_column :users, :created_at
    remove_column :users, :updated_at

    remove_column :goals, :created_at
    remove_column :goals, :updated_at

    remove_column :plans, :created_at
    remove_column :plans, :updated_at

    remove_column :evaluations, :created_at
    remove_column :evaluations, :updated_at
  end
end
