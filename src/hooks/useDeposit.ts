import { useMutation } from "@tanstack/react-query";
import { type GetQuoteDto, quoteApi } from "@/api";

export const useQuote = () => {
  //TODO: invalidate query
  // const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GetQuoteDto) => quoteApi.quoteControllerGetQuote({ getQuoteDto: data }),
  });
};

// export const useCreateDeposit = () => {
//   return useMutation({
//     //TODO: add type. Response quoteControllerGetQuote
//     mutationFn: (data: any) => transactionApi.transactionControllerCreateDepositTransactions({ body: data }),
//   });
// };
