import {makeAssistantVisible} from '@assistant-ui/react'

// Make the refund button intelligent
const SmartButton = makeAssistantVisible(
  ({onClick, children}) => <button onClick={onClick}>{children}</button>,
  {
    clickable: true, // Allow the assistant to click the button
  }
)

function TransactionHistory({transactions}) {
  return (
    <div className='transaction-list'>
      {transactions.map((transaction) => (
        <div key={transaction.id} className='transaction-item'>
          <span>${transaction.amount}</span>
          <span>{transaction.merchant}</span>
          <SmartButton onClick={() => handleRefund(transaction.id)}>Request Refund</SmartButton>
        </div>
      ))}
    </div>
  )
}

export function SmartTransactionHistory() {
  useAssistantInstructions(`
    You are a helpful banking assistant that:
    1. Helps users understand their transactions
    2. Explains refund policies
    3. Identifies suspicious transactions
    4. Guides users through the refund process
  `)

  return <TransactionHistory transactions={transactions} />
}

function SmartTransactionHistory({userProfile}) {
  const assistantRuntime = useAssistantRuntime()

  useEffect(() => {
    return assistantRuntime.registerModelContextProvider({
      getModelContext: () => ({
        system: `
          User spending patterns:
          - Average transaction: ${userProfile.avgTransaction}
          - Common merchants: ${userProfile.frequentMerchants.join(', ')}
          - Refund history: ${userProfile.refundCount} requests
        `,
      }),
    })
  }, [assistantRuntime, userProfile])

  // Previous components...
}
