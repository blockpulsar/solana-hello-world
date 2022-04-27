use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct GAccount {
    pub counter: u32
}

// Entrypoint is the entry point to the program, it will be called when the program is called i guess?
// process_instruction would be function that handles all the data
entrypoint!(process_instruction);


// Processor for the entrypoint
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    _instruction_data: &[u8]
) -> ProgramResult {
    msg!("Started Hello World program test");

    let accounts_iter = &mut accounts.iter();

    // Get account to say hello to
    let account = next_account_info(accounts_iter)?;
    
    // msg!("Account: {}", account.key);

    if account.owner != program_id {
        msg!("Greeted account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize
    let mut greeting_account = GAccount::try_from_slice(&account.data.borrow())?;
    greeting_account.counter += 1;

    // Serialize
    // Argument is where we write to i think.
    greeting_account.serialize(&mut &mut account.data.borrow_mut()[..])?;

    msg!("Greeted {} time(s)!", greeting_account.counter);

    Ok(())
}
