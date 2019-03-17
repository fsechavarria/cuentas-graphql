export const transformBill = bill => {
  return {
    ...bill,
    paymentDate: bill.paymentDate ? new Date(bill.paymentDate).toISOString() : null,
    createdAt: new Date(bill.createdAt).toISOString(),
    updatedAt: bill.updatedAt ? new Date(bill.updatedAt).toISOString() : null
  }
}
