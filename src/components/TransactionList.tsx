import { Text, TouchableOpacity, View } from "react-native";
import { Category, Transaction } from "../app/types";

export default function TransactionList({
  transactions,
  categories,
  deleteTransaction,
}: {
  categories: Category[];
  transactions: Transaction[];
  deleteTransaction: (id: number) => Promise<void>;
}) {
  return (
    <View style={{ gap: 15 }}>
      {transactions.map((transaction) => {
        return (
          <TouchableOpacity
            key={transaction.id}
            activeOpacity={0.7}
            onLongPress={() => deleteTransaction(transaction.id)}
          >
            <Text>
                {transaction.description} amount: {transaction.amount} date: {transaction.date}
                </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
