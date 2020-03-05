import React, { useState, useLayoutEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import useEventListener from '@use-it/event-listener'
import UI from '@UI/index'
import { SessionController } from '@Controllers/SessionController'

const appear = keyframes`
0% {
  background: rgba(41, 40, 38, 0)
}
100% {
  background: rgba(41, 40, 38, 0.8)
}
`

const MenuModal = styled('div')<{ isOpen: boolean }>`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 1000;
  background: rgba(41, 40, 38, 0.8);
  display: ${props => (props.isOpen ? 'block' : 'none')};
  animation: ${appear} 0.3s;
`

const MenuWrapper = styled.div`
  width: 700px;
  height: 800px;
  background: ${props => props.theme.primarySaturatedColor};
  border: ${props => `3px solid ${props.theme.secondaryColor}`};
  border-radius: 5px;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  max-width: 100%;
  max-height: 100%;
  color: white !important;
  padding: 1em;
  overflow: auto;
`

const SaveFileElement = styled.div`
  // border: ${props => `1px solid ${props.theme.secondaryColor}`};
  padding: 1em;
  margin: 1em auto;
  background: ${props => props.theme.primaryColor};
`

const Menu: React.FC<{}> = () => {
  const [isOpen, setOpen] = useState<boolean>(true)
  const [inputValue, setInput] = useState<string>('')
  const [isInputFocused, setInputFocus] = useState<boolean>(false)
  const [saveFiles, setSaveFiles] = useState<SessionController.ISaveFile[]>([])
  const sessionController = new SessionController(setSaveFiles)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const input = document.getElementById('savefile__input')
  const saveFile = (input: string) => {
    if (input.length !== 0) sessionController.Save(input)
    setInput('')
  }
  useEventListener('keydown', (event: any) => {
    if (event.key === 'Escape') setOpen(state => !state)
    if (event.key === 'Enter' && isInputFocused) saveFile(inputValue)
  })
  useEventListener(
    'blur',
    () => {
      setInputFocus(false)
    },
    input as HTMLElement,
  )
  useEventListener(
    'focus',
    () => {
      setInputFocus(true)
    },
    input as HTMLElement,
  )
  useLayoutEffect(() => {
    sessionController.LoadSaveFolder()
    return () => {
      sessionController.Unmount()
    }
  }, [])
  return (
    <MenuModal isOpen={isOpen}>
      <MenuWrapper>
        <UI.GrandText>Save file</UI.GrandText>
        <input id="savefile__input" type="text" value={inputValue} onChange={event => setInput(event.target.value)} />
        <UI.Button onClick={() => saveFile(inputValue)}>Save</UI.Button>
        {saveFiles.map((save, index) => (
          <SaveFileElement key={index}>
            <UI.GrandText>{save.name}</UI.GrandText>
            <button onClick={() => sessionController.Load(save.session_id)}>Load</button>
            <button onClick={() => sessionController.Delete(save.session_id)}>Delete</button>
            <br />
            <UI.RegularText>{save.session_id}</UI.RegularText>
            <br />
            <UI.RegularText>{save.date.toLocaleString()}</UI.RegularText>
          </SaveFileElement>
        ))}
      </MenuWrapper>
    </MenuModal>
  )
}

export default Menu
