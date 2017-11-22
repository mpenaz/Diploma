class Plan < ApplicationRecord
  has_and_belongs_to_many :goals
  belongs_to :evaluation, optional: true, dependent: :destroy 
  belongs_to :user
  validates :startDate, presence: true
  validates :endDate, presence: true
  validates :status, presence: true, inclusion: { in: %w(created completed reviewed) }
end
