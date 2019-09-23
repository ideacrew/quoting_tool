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
end

