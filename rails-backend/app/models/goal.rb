class Goal < ApplicationRecord
  has_many :goals
  has_and_belongs_to_many :plans
  validates :title, presence: true
  validates :description, presence: true
  validates :priority, presence: true
  validates :progress, presence: true
  validates :complexity, presence: true, inclusion: { in: %w(Shared Simple) }


  def shared_goals
    goal = Goal.find(id)
    response = []
    if goal.complexity == 'Shared'
      plans = goal.plans
      plans.each do |plan|
        obj = Hash.new
        obj['name'] = plan.user.name
        obj['user_id'] = plan.user.id
        obj['plan_id'] = plan.id
        response << obj
      end
    end
    response
  end

end
