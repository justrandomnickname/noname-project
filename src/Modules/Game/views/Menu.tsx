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
  width: 500px;
  height: 700px;
  background: ${props => props.theme.primaryColor};
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
`

const Menu: React.FC<{}> = () => {
  const [isOpen, setOpen] = useState<boolean>(true)
  const [inputValue, setInput] = useState<string>('')
  const sessionController = new SessionController()
  const [saveFiles, setSaveFiles] = useState<SessionController.ISaveFile[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEventListener('keydown', (event: any) => {
    if (event.key === 'Escape') setOpen(state => !state)
  })
  const getSaves = async () => {
    const saveFiles = await sessionController.GetSaveFiles()
    setSaveFiles([...saveFiles])
  }
  const saveFile = async (input: string) => {
    await sessionController.Save(input)
    getSaves()
  }
  // const deleteFile = async (sessionId: string) => {
  //   await sessionController.Delete(sessionId)
  // }
  useLayoutEffect(() => {
    getSaves()
    return () => {}
  }, [])
  return (
    <MenuModal isOpen={isOpen}>
      <MenuWrapper>
        <UI.GrandText>Save file</UI.GrandText>
        <input type="text" value={inputValue} onChange={event => setInput(event.target.value)} />
        <UI.Button onClick={() => saveFile(inputValue)}> Save </UI.Button>
        {saveFiles.map((save, index) => (
          <div key={index}>
            {save.name}: {save.id} <button onClick={() => sessionController.Load(save.id)}>Load</button>
            <button onClick={() => sessionController.Delete(save.id)}>Delete</button>
          </div>
        ))}
      </MenuWrapper>
    </MenuModal>
  )
}

export default Menu
