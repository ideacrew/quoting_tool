class Api::V1::EmployeesController < ApplicationController
  respond_to :json

  def upload
    file = params.require(:file)
    @roster_upload_form = ::Transactions::LoadCensusRecords.new.call(file)

    if @roster_upload_form.success?
      render :json => {status: "success", census_records: @roster_upload_form.value!.values}
    else
      render :json => {status: "failure", census_records: [], errors: @roster_upload_form.failure}
    end
  end

  def start_on_dates
    date = Date.today
    minimum_length = 5
    open_enrollment_end_on_day = 200
    # open_enrollment_end_on_day - minimum_length

    minimum_day = open_enrollment_end_on_day - minimum_length
    minimum_day.positive? ? minimum_day : 1

    start_on =  if date.day > minimum_day
                  date.beginning_of_month + 2.months
                else
                  date.prev_month.beginning_of_month + 2.months
                end

    end_on = date - (-2.months)
    dates = (start_on..end_on).select {|t| t == t.beginning_of_month}.map {|a| a.to_s}.map{ |a| a.gsub!("-","/")}
    render json: { dates: dates }
  end
end

