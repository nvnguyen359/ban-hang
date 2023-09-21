export interface NhapHang{
    //Id	Tên sản phẩm	Sản Phẩm	Số Lượng	Đơn Vị Tính	Giá Nhập	Giá Bán	Thành tiền	Ghi chú	Ngày Nhập
    'Id'?:string,
    'Tên sản phẩm':string,
    'Sản Phẩm':string,
    'Số Lượng':number,
    'Đơn Vị Tính':string,
    'Giá Nhập':number,
    'Giá Bán':number,
    'Thành tiền':number,
    'Ghi chú':number,
    'Ngày Nhập':Date,
    index:number
}
export interface GroupDate{
    date:any,
    nhaphang: any[],
    quantity:any,
    tong:any,
    count:any
}