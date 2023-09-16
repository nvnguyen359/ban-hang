export interface ChiTietDonHang{
    //Id	Sản Phẩm	Tên Sản Phẩm	Đơn giá	Số Lượng	Đơn Vị Tính	Thành Tiền	Ngày	Giá Nhập	Đơn Hàng
    Id?:string,
    'Sản Phẩm':string,
    'Tên sản phẩm':string,
    'Đơn giá':number,
    'Số Lượng':number,
    'Đơn Vị Tính':string,
    'Thành Tiền':number,
    'Ngày':Date,
    'Giá Nhập':number,
    'Đơn Hàng':Date,
    'STT':number,
    'Name'?:string,
    'Giá Bán'?:number,
    'Tên Sản Phẩm':string,

}
export class ChiTiet{
    //Id	Sản Phẩm	Tên Sản Phẩm	Đơn giá	Số Lượng	Đơn Vị Tính	Thành Tiền	Ngày	Giá Nhập	Đơn Hàng
    Id?:string;
    'Tên Sản Phẩm':string;
    'Đơn giá':number;
    'Số Lượng':number;
    'Đơn Vị Tính':string;
    'Thành Tiền':number;
    'Giá Nhập':number;
    'Đơn Hàng':Date;
    'STT':number;
}