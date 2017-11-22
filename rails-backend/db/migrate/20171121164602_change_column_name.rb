class ChangeColumnName < ActiveRecord::Migration[5.0]
  def change
    rename_column :plans, :end, :endDate
    rename_column :plans, :start, :startDate
  end
end
