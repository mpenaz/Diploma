# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Evaluation.destroy_all
Goal.destroy_all
User.destroy_all
Plan.destroy_all

#User.create(name: 'Adam New', email: 'adam.new@mycompany.com', manager_id: nil) test user for first login auto registration scenario
_manager = User.create(name: 'Peter Boss', email: 'peter.boss@mycompany.com', manager_id: nil)

_johnDoe = User.create(name: 'John Doe', email: 'john.doe@mycompany.com', manager_id: _manager.id)
_joshBrown = User.create(name: 'Josh Brown', email: 'josh.brown@mycompany.com', manager_id: _johnDoe.id)
_petrNovak = User.create(name: 'Petr Novak', email: 'petr.novak@mycompany.com', manager_id: _johnDoe.id)
_tomHardy = User.create(name: 'Tom Hardy', email: 'tom.hardy@mycompany.com', manager_id: _johnDoe.id)
_adamNovotny = User.create(name: 'Adam Novotny', email: 'adam.novotny@mycompany.com', manager_id: _johnDoe.id)
_petrDvorak = User.create(name: 'Petr Dvorak', email: 'petr.dvorak@mycompany.com', manager_id: _johnDoe.id)
_emilStary = User.create(name: 'Emil Stary', email: 'emil.stary@mycompany.com', manager_id: _johnDoe.id)

_villaSye = User.create(name: 'Villa Sye', email: 'villa.sye@mycompany.com', manager_id: _manager.id)

_johnEvaluation = Evaluation.create(description: 'Velmi dobre plnil svoje ukoly.', rating: 9)
_joshEvaluation = Evaluation.create(description: 'Velmi dobre plnil svoje ukoly.', rating: 10)

johnPlanOld = Plan.create(startDate: '1.1.2016', endDate: '1.1.2017', status: 'reviewed', user_id: _johnDoe.id, evaluation_id: _johnEvaluation.id)
johnPlan = Plan.create(startDate: '1.1.2017', endDate: '1.1.2018', status: 'created', user_id: _johnDoe.id, evaluation_id: nil)
villaPlan = Plan.create(startDate: '1.1.2017', endDate: '1.1.2018', status: 'created', user_id: _villaSye.id, evaluation_id: nil)

joshPlan = Plan.create(startDate: '1.1.2009', endDate: '1.1.2010', status: 'reviewed', user_id: _joshBrown.id, evaluation_id: _joshEvaluation.id)
joshPlan1 = Plan.create(startDate: '1.1.2010', endDate: '1.1.2011', status: 'completed', user_id: _joshBrown.id, evaluation_id: nil)
joshPlan2 = Plan.create(startDate: '1.1.2011', endDate: '1.1.2012', status: 'created', user_id: _joshBrown.id, evaluation_id: nil)
petrPlan = Plan.create(startDate: '1.1.2009', endDate: '1.1.2010', status: 'created', user_id: _petrNovak.id, evaluation_id: nil)
hardyPlan = Plan.create(startDate: '1.1.2009', endDate: '1.1.2010', status: 'created', user_id: _tomHardy.id, evaluation_id: nil)
novotnyPlan = Plan.create(startDate: '1.1.2009', endDate: '1.1.2010', status: 'created', user_id: _adamNovotny.id, evaluation_id: nil)

_goal1 = Goal.create(title: 'Diploma thesis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam.', complexity: 'Simple', priority: 'High', progress: 0)
johnPlanOld.goals << _goal1

_goal1 = Goal.create(title: 'Diploma thesis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam.', complexity: 'Simple', priority: 'High', progress: 0)
_goal2 = Goal.create(title: 'Rails backend', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam.', complexity: 'Simple', priority: 'High', progress: 50)

johnPlan.goals << _goal1
johnPlan.goals << _goal2

_goal1 = Goal.create(title: 'Diploma thesis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam..', complexity: 'Simple', priority: 'High', progress: 0)
joshPlan.goals << _goal1

_goal1 = Goal.create(title: 'Diploma thesis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam..', complexity: 'Simple', priority: 'High', progress: 0)
petrPlan.goals << _goal1
_goal1 = Goal.create(title: 'Diploma thesis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam..', complexity: 'Simple', priority: 'High', progress: 0)

hardyPlan.goals << _goal1
_goal1 = Goal.create(title: 'Diploma thesis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam..', complexity: 'Simple', priority: 'High', progress: 0)
novotnyPlan.goals << _goal1

_goal1 = Goal.create(title: 'Rails backend', description: 'Develop rails backend application.', complexity: 'Simple', priority: 'High', progress: 100)
joshPlan1.goals << _goal1
_goal1 = Goal.create(title: 'Angular frontned', description: 'Develop angular frontend application.', complexity: 'Simple', priority: 'High', progress: 100)
joshPlan1.goals << _goal1
_goal1 = Goal.create(title: 'Write thesis', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi bibendum vel quam id iaculis. Fusce in mi semper, eleifend quam vel, tempus turpis. Fusce nulla dui, dapibus in urna vel, luctus fringilla metus. Etiam rhoncus sed turpis quis gravida. Duis maximus ante ut ullamcorper pulvinar. Suspendisse nec erat magna. Etiam..', complexity: 'Simple', priority: 'High', progress: 100)
joshPlan1.goals << _goal1
_goal1 = Goal.create(title: 'Finish masters', description: 'Pass finals.', complexity: 'Simple', priority: 'High', progress: 80)
joshPlan1.goals << _goal1


_goal1 = Goal.create(title: 'Shared goal 1', description: 'Shared goal description.', complexity: 'Shared', priority: 'High', progress: 80, user_id: _johnDoe.id)
_goal2 = Goal.create(title: 'Shared goal 2', description: 'Shared goal description.', complexity: 'Shared', priority: 'High', progress: 80, user_id: _johnDoe.id)
joshPlan2.goals << _goal1
joshPlan2.goals << _goal2
petrPlan.goals << _goal1
petrPlan.goals << _goal2

_goal1 = Goal.create(title: 'Shared goal 1', description: 'Shared goal description.', complexity: 'Shared', priority: 'High', progress: 80, user_id: _manager.id)
_goal2 = Goal.create(title: 'Shared goal 2', description: 'Shared goal description.', complexity: 'Shared', priority: 'High', progress: 80, user_id: _manager.id)
johnPlan.goals << _goal1
johnPlan.goals << _goal2
villaPlan.goals << _goal1
villaPlan.goals << _goal2

_goal1 = Goal.create(title: 'Shared goal for transfer 1', description: 'Shared goal description.', complexity: 'Shared', priority: 'High', progress: 80, user_id: _manager.id)
johnPlanOld.goals << _goal1
villaPlan.goals << _goal1
