export default function FormCard({ children, currentStep, totalSteps }) {

  return (
    <div className='formCard'>
      <div className="mainStepContainer">
        {Array.from(Array(totalSteps + 1), (e, i) => {
          return (
            <div key={i} className={currentStep === i ? 'StepContainerCurrent' : 'StepContainer'}>
              <span className="steptitle">{i + 1}</span>
            </div>
          )

        })}
      </div>
      {children}
    </div>
  );
}