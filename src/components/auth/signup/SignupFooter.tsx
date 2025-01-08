interface SignupFooterProps {
  onToggleMode: () => void;
  isLoading: boolean;
}

export function SignupFooter({ onToggleMode, isLoading }: SignupFooterProps) {
  return (
    <div className="text-center space-y-4">
      <p className="text-sm text-gray-500">
        By clicking Create account you agree to Recognotes{' '}
        <a href="/terms" className="text-[#7F56D9] hover:underline">
          Term's of use
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-[#7F56D9] hover:underline">
          Privacy policy
        </a>
      </p>
    </div>
  )
}