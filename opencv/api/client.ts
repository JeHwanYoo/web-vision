import Command from './command'

const data: Command[] = [
  {
    pythonFileName: 'to_gray.py',
    label: 'to_gray',
  },
  {
    pythonFileName: 'threshold_127.py',
    label: 'threshold binary(127)',
  },
  {
    pythonFileName: 'canny.py',
    label: 'canny edge(50, 70)',
  },
  {
    // This command will not be displayed to the client.
    pythonFileName: 'disable.py',
    label: 'disable example',
    disable: true,
  },
]

export const commandList: Command[] = data.filter(v => !v.disable)
