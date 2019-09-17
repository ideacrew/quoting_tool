class Api::V1::EmployeesController < ApplicationController
  respond_to :json

  def upload
    file = params.require(:file)
    @roster_upload_form = ::Forms::RosterUploadForm.call(file)

    if @roster_upload_form.save
      render :json => {status: "success", census_records: @roster_upload_form.output_json.values}
    else
      render :json, {status: "failure", errors: @roster_upload_form.errors.full_messages}
    end
  end
end

