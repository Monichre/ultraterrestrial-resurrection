

export interface LayeredStackProps {

}

export const LayeredStack: React.FC<LayeredStackProps> = ( props: LayeredStackProps ) => {
  return (
    <div>
      <div className="stack">
        <div className="content card">
          <p><b><span id="desktop-prompt">Hover</span><span id="mobile-prompt">Tap</span> me!</b></p>
          <p>I'm just some example text content so there's something inside this box, nothing much to see here.</p>
        </div>
        <div className="padding card"></div>
        <div className="border card"></div>
        <div className="background card"></div>
        <div className="box-shadow card"></div>
      </div>

    </div>
  )
}



