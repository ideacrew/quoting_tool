# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.6'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'activemodel', '~> 6.0.0'
gem 'rails', '~> 6.0.0'

# Use Puma as the app server
gem 'puma', '~> 3.12'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.4.2', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
gem 'aws-sdk'
gem 'rack-cors'
# Use to dry up responses
gem 'responders'

# MongoDB NoSQL database ORM
# gem 'mongoid',                  '~> 7.0'
gem 'mongoid', git: 'https://github.com/mongodb/mongoid.git', branch: 'master'

# Settings, validation and dependency injection
gem 'fast_jsonapi'
gem 'money-rails', '~> 1.13'
gem 'nokogiri', '~> 1.10'
gem 'nokogiri-happymapper', '~> 0.8.0', require: 'happymapper'
gem 'resource_registry', git: 'https://github.com/ideacrew/resource_registry.git', branch: 'trunk'
gem 'roo', '~> 2.1'
gem 'roo-xls'
gem 'virtus', '~> 1.0'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: %i[mri mingw x64_mingw]
  gem 'climate_control'
  gem 'factory_bot_rails', '~> 4.11'
  gem 'pry-byebug'
  gem 'rspec-rails', '~> 3.8'
  gem 'yard' # ,                   '~> 0.9.12',  require: false
end

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'

  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'web-console',            '>= 3'

  gem 'rubocop',                require: false
  gem 'rubocop-git'
  gem 'rubocop-rspec'
end

group :test do
  gem 'database_cleaner'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]
