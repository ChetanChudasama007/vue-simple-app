import StudentModel from '@/model/StudentModel';
export default class RegistrationDetailModel extends StudentModel {
    public phoneNumber: string;
    public country: string;
    public gender: string;
    public dateOfBirth: string;
    public fileUrl: string;
    public file: string;
    public fileType: string;
    public role: string;
}
